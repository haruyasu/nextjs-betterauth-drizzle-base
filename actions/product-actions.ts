"use server"

import { getServerSession } from "@/lib/auth"

interface RainforestSearchParams {
  api_key: string
  type: string
  amazon_domain: string
  search_term: string
  max_page?: number
  include_fields?: string
  sort_by?: string
}

interface RainforestProduct {
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

export async function searchProducts(
  searchTerm: string,
  maxResults: number = 20
) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  if (!process.env.RAINFOREST_API_KEY) {
    throw new Error("Rainforest API key が設定されていません")
  }

  const params: RainforestSearchParams = {
    api_key: process.env.RAINFOREST_API_KEY,
    type: "search",
    amazon_domain: "amazon.co.jp",
    search_term: searchTerm,
    max_page: Math.ceil(maxResults / 20),
    include_fields: "search_results",
    sort_by: "average_review",
  }

  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value)
      return acc
    }, {} as Record<string, string>)
  ).toString()

  try {
    console.log(
      "Rainforest API リクエスト URL:",
      `https://api.rainforestapi.com/request?${queryString}`
    )

    const response = await fetch(
      `https://api.rainforestapi.com/request?${queryString}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Rainforest API エラー詳細:", errorText)
      throw new Error(
        `Rainforest API エラー: ${response.status} - ${errorText}`
      )
    }

    const data = await response.json()

    // 検索結果を整理
    const products: RainforestProduct[] = data.search_results || []

    // 各商品データを安全に処理
    const safeProducts = products.map((product) => ({
      ...product,
      title: product.title || "タイトル不明",
      price: product.price || {
        symbol: "¥",
        value: 0,
        currency: "JPY",
        raw: "価格不明",
      },
      rating: product.rating || 0,
      ratings_total: product.ratings_total || 0,
      is_prime: product.is_prime || false,
      asin: product.asin || "",
      link: product.link || "",
      image: product.image || "",
    }))

    return safeProducts.slice(0, maxResults)
  } catch (error) {
    console.error("商品検索エラー:", error)
    throw new Error("商品検索に失敗しました")
  }
}
