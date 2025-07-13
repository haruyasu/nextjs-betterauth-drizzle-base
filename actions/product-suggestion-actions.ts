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

// 商品提案件数
const SUGGESTION_COUNT = 4

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

    // 3. Amazon商品検索を実行（評価順で取得）
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

    // 4. 商品のタイトルと評価を分析して最適な商品を${SUGGESTION_COUNT}件に厳選
    const recommendationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは商品レコメンドの専門家です。以下の商品リストと要求仕様を基に、最適な商品を**必ず${SUGGESTION_COUNT}件だけ**選んで推薦してください。

          推薦基準：
          1. 要求仕様との適合度（商品タイトルから判断）
          2. 価格帯との適合性
          3. 商品評価（★の数）
          4. レビュー数（信頼性の指標）
          5. ユーザーの優先度（価格/品質/機能/ブランド）

          **判断材料：**
          - 商品タイトル（機能や特徴を含む）
          - 価格
          - 評価（★の数）
          - レビュー数
          - Prime対応有無

          **重要な指示：**
          - **必ず${SUGGESTION_COUNT}件の商品のみ**を選んで推薦してください
          - 各推薦商品について、必ず正確なASIN番号を明記してください
          - 商品タイトルと評価から適切に判断してください
          - 推薦しない商品については言及しないでください

          **出力形式：マークダウン形式で構造化した推薦レポートを作成してください**

          以下の構造で回答してください：
          
          ## 厳選商品${SUGGESTION_COUNT}件の推薦理由
          なぜこの${SUGGESTION_COUNT}件を選んだかの総合的な判断理由
          
          ## 推薦商品詳細（${SUGGESTION_COUNT}件のみ）
          
          ${Array.from(
            { length: SUGGESTION_COUNT },
            (_, i) => `### ${i + 1}. 商品名
          - **ASIN**: B0XXXXXXXXX
          - **推薦理由**：なぜこの商品を選んだか（タイトルから判断できる機能・特徴を含む）
          - **価格の妥当性**：価格帯との適合性
          - **評価・信頼性**：★評価とレビュー数から判断できる信頼性
          - **注意点・検討事項**：商品タイトルから推測できる注意点`
          ).join("\n\n          ")}
          
          ## 最終購入アドバイス
          ${SUGGESTION_COUNT}件の中での選択基準とおすすめ順位`,
        },
        {
          role: "user",
          content: `要求仕様:
          ${JSON.stringify(requirements, null, 2)}

          検索キーワード: ${searchKeyword}

          商品一覧（評価順に並んでいます、この中から${SUGGESTION_COUNT}件を厳選してください）:
          ${products
            .map(
              (p, i) =>
                `${i + 1}. ${p.title}
              - ASIN: ${p.asin}
              - 価格: ${p.price?.raw || "価格不明"}
              - 評価: ${p.rating || "評価なし"}★ (${
                  p.ratings_total || 0
                }件のレビュー)
              - Prime: ${p.is_prime ? "対応" : "非対応"}
              - リンク: ${p.link}
              `
            )
            .join("\n")}

          上記の商品情報を基に、商品タイトルと評価から判断して、ユーザーの要求に最も適した商品を**必ず${SUGGESTION_COUNT}件だけ**選んで詳しく推薦してください。`,
        },
      ],
      temperature: 0.7,
    })

    let recommendation =
      recommendationResponse.choices[0]?.message?.content || ""

    // 5. 推薦されたASINを抽出（${SUGGESTION_COUNT}件のみ）
    const recommendedAsins = extractRecommendedAsins(recommendation)
    console.log("推薦されたASIN:", recommendedAsins)

    // 6. 推薦された商品のみをフィルタリング（最大${SUGGESTION_COUNT}件）
    let recommendedProducts = products
      .filter((product) => recommendedAsins.includes(product.asin))
      .slice(0, SUGGESTION_COUNT) // 安全のため${SUGGESTION_COUNT}件に制限

    console.log(
      `推薦商品フィルタリング: 全${products.length}件から${recommendedProducts.length}件を選択`
    )

    // 7. ${SUGGESTION_COUNT}件に満たない場合のフォールバック処理
    if (recommendedProducts.length < SUGGESTION_COUNT) {
      console.warn(
        `警告: 推薦商品が${recommendedProducts.length}件のみです。フォールバック処理を実行します。`
      )

      // 評価とレビュー数で商品をソート（既に評価順で取得済みだが、念のため再ソート）
      const sortedProducts = products.sort((a, b) => {
        const scoreA = (a.rating || 0) * Math.log(1 + (a.ratings_total || 0))
        const scoreB = (b.rating || 0) * Math.log(1 + (b.ratings_total || 0))
        return scoreB - scoreA
      })

      // 既に選択された商品のASINを取得
      const selectedAsins = recommendedProducts.map((p) => p.asin)

      // 不足分を補完
      const remainingProducts = sortedProducts.filter(
        (p) => !selectedAsins.includes(p.asin)
      )

      const additionalProducts = remainingProducts.slice(
        0,
        SUGGESTION_COUNT - recommendedProducts.length
      )
      recommendedProducts = [...recommendedProducts, ...additionalProducts]

      console.log(
        `フォールバック完了: 追加${additionalProducts.length}件、合計${recommendedProducts.length}件`
      )

      // フォールバック使用の情報を推薦文に追加
      if (additionalProducts.length > 0) {
        const fallbackNote = `\n\n---\n**注意**: 一部の商品は評価と信頼性に基づいて自動選択されました。`
        recommendation += fallbackNote
      }
    }

    // 8. データベースに結果を保存（推薦された${SUGGESTION_COUNT}件のみ）
    await db.insert(productRecommendations).values({
      id: nanoid(),
      sessionId: null,
      userId: session.user.id,
      query: userQuery,
      analysisResult: JSON.stringify({
        requirements,
        searchKeyword,
      }),
      recommendation,
      productData: JSON.stringify(recommendedProducts), // 厳選された${SUGGESTION_COUNT}件のみ保存
      reviewData: JSON.stringify({}), // レビューデータは使用しない
      success: true,
    })

    return {
      requirements,
      searchKeyword,
      recommendation,
      products: recommendedProducts, // 厳選された${SUGGESTION_COUNT}件のみ返す
      success: true,
    }
  } catch (error) {
    console.error("商品提案エラー:", error)

    // エラー時もデータベースに保存
    await db.insert(productRecommendations).values({
      id: nanoid(),
      sessionId: null,
      userId: session.user.id,
      query: userQuery,
      analysisResult: JSON.stringify({
        requirements: {
          category: "エラー",
          priceRange: "エラー",
          features: [],
          priority: "quality" as const,
        },
        searchKeyword: "",
      }),
      recommendation: `申し訳ございません。商品提案の処理中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
      productData: JSON.stringify([]),
      reviewData: JSON.stringify({}),
      success: false,
    })

    return {
      requirements: {
        category: "エラー",
        priceRange: "エラー",
        features: [],
        priority: "quality" as const,
      },
      searchKeyword: "",
      recommendation: `申し訳ございません。商品提案の処理中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
      products: [],
      success: false,
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

/**
 * AIレコメンデーション文章から推薦されたASINを抽出
 */
function extractRecommendedAsins(recommendationText: string): string[] {
  // 複数のASINパターンを検索
  const patterns = [
    /\*\*ASIN\*\*:\s*(B[0-9A-Z]{9})/gi, // **ASIN**: B0XXXXXXXXX
    /ASIN:\s*(B[0-9A-Z]{9})/gi, // ASIN: B0XXXXXXXXX
    /- \*\*ASIN\*\*:\s*(B[0-9A-Z]{9})/gi, // - **ASIN**: B0XXXXXXXXX
    /ASIN\s*:\s*(B[0-9A-Z]{9})/gi, // ASIN : B0XXXXXXXXX (スペース込み)
    /\(ASIN:\s*(B[0-9A-Z]{9})\)/gi, // (ASIN: B0XXXXXXXXX)
  ]

  const allAsins: string[] = []

  // 各パターンでマッチを探す
  patterns.forEach((pattern) => {
    const matches = Array.from(
      recommendationText.matchAll(pattern),
      (m) => m[1]
    )
    allAsins.push(...matches)
  })

  // 重複を除去
  const uniqueAsins = [...new Set(allAsins)]

  // ${SUGGESTION_COUNT}件に満たない場合の詳細ログ
  if (uniqueAsins.length < SUGGESTION_COUNT) {
    console.warn(
      `⚠️ ASIN抽出が${SUGGESTION_COUNT}件未満です。推薦テキストの形式を確認してください。`
    )
    console.log("推薦テキストの最初の500文字:")
    console.log(recommendationText.substring(0, 500))
  }

  return uniqueAsins
}
