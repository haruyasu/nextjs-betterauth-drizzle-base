"use client"

import { ProductCard } from "@/components/dashboard/ProductCard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Markdown } from "@/components/ui/markdown"
import {
  AlertCircle,
  CheckCircle,
  Search,
  ShoppingCart,
  Target,
  TrendingUp,
} from "lucide-react"

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

interface ProductSuggestionResultProps {
  result: {
    requirements?: {
      category: string
      priceRange: string
      features: string[]
      brand?: string
      size?: string
      color?: string
      usage?: string
      priority: "price" | "quality" | "features" | "brand"
    }
    searchKeyword?: string
    recommendation: string
    products: Product[]
    success: boolean
    error?: string
  }
}

export function ProductSuggestionResult({
  result,
}: ProductSuggestionResultProps) {
  const priorityLabels = {
    price: "価格重視",
    quality: "品質重視",
    features: "機能重視",
    brand: "ブランド重視",
  }

  const priorityIcons = {
    price: TrendingUp,
    quality: CheckCircle,
    features: Target,
    brand: ShoppingCart,
  }

  if (!result.success) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">エラーが発生しました</span>
          </div>
          <p className="text-gray-700">
            {result.error || "商品提案の生成に失敗しました"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 分析結果サマリー */}
      {result.requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              分析結果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">カテゴリ</p>
                <p className="font-medium">{result.requirements.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">価格帯</p>
                <p className="font-medium">{result.requirements.priceRange}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">優先度</p>
                <div className="flex items-center gap-1">
                  {(() => {
                    const Icon = priorityIcons[result.requirements.priority]
                    return <Icon className="h-4 w-4" />
                  })()}
                  <span className="font-medium">
                    {priorityLabels[result.requirements.priority]}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">検索キーワード</p>
                <div className="flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  <span className="font-medium">{result.searchKeyword}</span>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.requirements.features.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">重要な機能・特徴</p>
                  <div className="flex flex-wrap gap-1">
                    {result.requirements.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {result.requirements.brand && (
                  <div>
                    <span className="text-sm text-gray-500">ブランド: </span>
                    <span className="font-medium">
                      {result.requirements.brand}
                    </span>
                  </div>
                )}
                {result.requirements.size && (
                  <div>
                    <span className="text-sm text-gray-500">サイズ: </span>
                    <span className="font-medium">
                      {result.requirements.size}
                    </span>
                  </div>
                )}
                {result.requirements.color && (
                  <div>
                    <span className="text-sm text-gray-500">色: </span>
                    <span className="font-medium">
                      {result.requirements.color}
                    </span>
                  </div>
                )}
                {result.requirements.usage && (
                  <div>
                    <span className="text-sm text-gray-500">用途: </span>
                    <span className="font-medium">
                      {result.requirements.usage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AIレコメンデーション */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            AI推薦レポート
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown>{result.recommendation}</Markdown>
        </CardContent>
      </Card>

      {/* 商品一覧 */}
      {result.products && result.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              推薦商品 ({result.products.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
