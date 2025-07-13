"use server"

import { getServerSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { productRecommendations } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"

export interface SuggestionHistoryItem {
  id: string
  query: string
  productData: any[]
  createdAt: Date
  productCount: number
  firstProductTitle?: string
}

export interface SuggestionDetail {
  id: string
  query: string
  productData: any[]
  reviewData?: any[]
  createdAt: Date
  analysis: {
    requirements: {
      category: string
      priceRange: string
      features: string[]
      brand?: string
      size?: string
      color?: string
      usage?: string
      priority: "price" | "quality" | "features" | "brand"
    }
    searchKeyword: string
    recommendation: string
  }
  success: boolean
}

/**
 * ユーザーの商品提案履歴を取得
 */
export async function getSuggestionHistory(): Promise<SuggestionHistoryItem[]> {
  const session = await getServerSession()

  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  const recommendations = await db
    .select({
      id: productRecommendations.id,
      query: productRecommendations.query,
      productData: productRecommendations.productData,
      createdAt: productRecommendations.createdAt,
    })
    .from(productRecommendations)
    .where(eq(productRecommendations.userId, session.user.id))
    .orderBy(desc(productRecommendations.createdAt))

  return recommendations.map((rec) => {
    const products = JSON.parse(rec.productData || "[]")
    return {
      id: rec.id,
      query: rec.query,
      productData: products,
      createdAt: rec.createdAt,
      productCount: products.length,
      firstProductTitle: products[0]?.title || undefined,
    }
  })
}

/**
 * 特定の商品提案の詳細を取得
 */
export async function getSuggestionDetail(
  id: string
): Promise<SuggestionDetail | null> {
  const session = await getServerSession()

  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  const recommendation = await db
    .select()
    .from(productRecommendations)
    .where(
      and(
        eq(productRecommendations.id, id),
        eq(productRecommendations.userId, session.user.id)
      )
    )
    .limit(1)

  if (!recommendation[0]) {
    return null
  }

  const rec = recommendation[0]
  const productData = JSON.parse(rec.productData || "[]")
  const reviewData = JSON.parse(rec.reviewData || "[]")
  const analysisResult = JSON.parse(rec.analysisResult || "{}")

  return {
    id: rec.id,
    query: rec.query,
    productData,
    reviewData,
    createdAt: rec.createdAt,
    analysis: {
      requirements: analysisResult.requirements || {
        category: "未設定",
        priceRange: "未設定",
        features: [],
        priority: "quality" as const,
      },
      searchKeyword: analysisResult.searchKeyword || "",
      recommendation: rec.recommendation || "推薦情報が見つかりません",
    },
    success: rec.success || true,
  }
}

/**
 * 商品提案を削除
 */
export async function deleteSuggestion(id: string): Promise<void> {
  const session = await getServerSession()

  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  await db
    .delete(productRecommendations)
    .where(
      and(
        eq(productRecommendations.id, id),
        eq(productRecommendations.userId, session.user.id)
      )
    )
}

/**
 * ユーザーの提案総数を取得
 */
export async function getSuggestionCount(): Promise<number> {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return 0
    }

    const count = await db
      .select()
      .from(productRecommendations)
      .where(eq(productRecommendations.userId, session.user.id))

    return count.length
  } catch (error) {
    console.error("提案数取得エラー:", error)
    return 0
  }
}
