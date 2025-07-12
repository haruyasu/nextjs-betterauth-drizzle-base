"use server"

import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { productRecommendations } from "@/lib/db/schema"
import { nanoid } from "nanoid"
import OpenAI from "openai"
import { searchProducts } from "./product-actions"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ProductRequirements {
  category: string
  priceRange: string
  features: string[]
  brand?: string
  size?: string
  color?: string
  usage?: string
  priority: "price" | "quality" | "features" | "brand"
}

interface Product {
  position: number
  title: string
  asin: string
  link: string
  image: string
  rating: number
  ratings_total: number
  price: {
    symbol: string
    value: number
    currency: string
    raw: string
  }
  is_prime: boolean
}

interface ProductSuggestionResult {
  requirements: ProductRequirements
  searchKeyword: string
  recommendation: string
  products: Product[]
  success: boolean
  error?: string
}

export async function generateProductSuggestion(
  userQuery: string
): Promise<ProductSuggestionResult> {
  const session = await getServerSession()

  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  try {
    // 1. OpenAI Function callingで商品提案に必要な情報を構造化
    const tools = [
      {
        type: "function" as const,
        function: {
          name: "extract_product_requirements",
          description: "ユーザーの商品要求から必要な情報を抽出して構造化する",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description:
                  "商品カテゴリ（例：テレビ、ノートパソコン、スマートフォン）",
              },
              priceRange: {
                type: "string",
                description: "価格帯（例：1万円以下、5万円～10万円、予算なし）",
              },
              features: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "重要な機能・特徴のリスト",
              },
              brand: {
                type: "string",
                description: "希望ブランド（指定がない場合は空文字）",
              },
              size: {
                type: "string",
                description: "サイズ要求（例：50インチ、13インチ、コンパクト）",
              },
              color: {
                type: "string",
                description: "色の要求（指定がない場合は空文字）",
              },
              usage: {
                type: "string",
                description: "使用目的・用途（例：ゲーム、仕事、家族で使用）",
              },
              priority: {
                type: "string",
                enum: ["price", "quality", "features", "brand"],
                description: "最重要視する要素",
              },
            },
            required: ["category", "priceRange", "features", "priority"],
            additionalProperties: false,
          },
        },
      },
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは商品提案の専門家です。ユーザーの商品要求を分析して、Amazon.co.jpで検索するのに最適な情報を抽出してください。

          重要なポイント：
          - 商品カテゴリは具体的かつ検索しやすい名称にする
          - 価格帯は日本円で現実的な範囲を指定
          - 機能・特徴は検索に役立つキーワードを含める
          - ユーザーの最重要視する要素を適切に判定する`,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      tools,
      tool_choice: {
        type: "function",
        function: { name: "extract_product_requirements" },
      },
    })

    const toolCall = response.choices[0]?.message?.tool_calls?.[0]
    if (
      !toolCall ||
      toolCall.function.name !== "extract_product_requirements"
    ) {
      throw new Error("商品要求の分析に失敗しました")
    }

    const requirements: ProductRequirements = JSON.parse(
      toolCall.function.arguments
    )

    // 2. 構造化された情報を基に検索キーワードを生成
    const searchKeyword = generateSearchKeyword(requirements)

    // 3. Amazon商品検索を実行
    const products = await searchProducts(searchKeyword, 10)

    if (!products || products.length === 0) {
      return {
        requirements,
        searchKeyword,
        recommendation: `申し訳ございません。「${searchKeyword}」での検索では商品が見つかりませんでした。より一般的なキーワードで再度お試しください。`,
        products: [],
        success: false,
      }
    }

    // 4. 商品リストを分析して最適な商品を推薦
    const recommendationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは商品レコメンドの専門家です。以下の商品リストと要求仕様を基に、最適な商品を3-5個選んで推薦してください。

          推薦基準：
          1. 要求仕様との適合度
          2. 価格帯との適合性
          3. 機能・特徴の充実度
          4. 商品評価・レビュー数
          5. ユーザーの優先度（価格/品質/機能/ブランド）

          **出力形式：マークダウン形式で構造化した推薦レポートを作成してください**

          以下の構造で回答してください：
          
          ## 推薦商品の概要
          簡潔な推薦サマリー
          
          ## 推薦商品詳細
          
          各商品について以下を含めて説明してください：
          ### 商品名
          - **推薦理由**：なぜこの商品を選んだか
          - **主要な特徴・機能**：重要な機能やスペック
          - **価格の妥当性**：価格帯との適合性
          - **評価・レビュー状況**：★評価とレビュー数
          - **注意点・検討事項**：購入前に知っておくべきこと
          
          ## 購入の決定ポイント
          最終的な選択のためのアドバイス

          推薦は具体的で購入の決定に役立つ情報を提供してください。`,
        },
        {
          role: "user",
          content: `ユーザーの要求：
          - カテゴリ: ${requirements.category}
          - 価格帯: ${requirements.priceRange}
          - 重要な機能: ${requirements.features.join(", ")}
          - ブランド: ${requirements.brand || "指定なし"}
          - サイズ: ${requirements.size || "指定なし"}
          - 色: ${requirements.color || "指定なし"}
          - 用途: ${requirements.usage || "指定なし"}
          - 優先度: ${requirements.priority}

          検索結果:
          ${products
            .map(
              (product, index) => `
          ${index + 1}. ${product.title || "タイトル不明"}
          - 価格: ${product.price?.raw || "価格不明"}
          - 評価: ${product.rating || "N/A"}/5 (${product.ratings_total || 0}件)
          - Prime: ${product.is_prime ? "あり" : "なし"}
          - ASIN: ${product.asin || "N/A"}
          `
            )
            .join("\n")}

          上記の商品から、ユーザーの要求に最も適した商品を選んで詳しく推薦してください。`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const recommendation =
      recommendationResponse.choices[0]?.message?.content ||
      "推薦の生成に失敗しました"

    // 5. 結果をデータベースに保存
    await db.insert(productRecommendations).values({
      id: nanoid(),
      sessionId: null, // チャット機能は不要なのでnull
      userId: session.user.id,
      productData: JSON.stringify(products),
      query: userQuery,
    })

    return {
      requirements,
      searchKeyword,
      recommendation,
      products: products.slice(0, 5),
      success: true,
    }
  } catch (error) {
    console.error("商品提案生成エラー:", error)
    return {
      requirements: {} as ProductRequirements,
      searchKeyword: "",
      recommendation:
        "商品提案の生成中にエラーが発生しました。もう一度お試しください。",
      products: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function generateSearchKeyword(requirements: ProductRequirements): string {
  const parts = [requirements.category]

  if (requirements.brand) parts.push(requirements.brand)
  if (requirements.size) parts.push(requirements.size)
  if (requirements.color) parts.push(requirements.color)

  // 機能・特徴から重要なキーワードを追加
  const importantFeatures = requirements.features.slice(0, 2) // 最初の2つの特徴
  parts.push(...importantFeatures)

  return parts.join(" ")
}
