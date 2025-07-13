"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { generateProductSuggestion } from "@/actions/product-suggestion-actions"
import { ProductSuggestionResult } from "./ProductSuggestionResult"
import { ShoppingCart, Sparkles } from "lucide-react"

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

interface ProductSuggestionData {
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

interface ProductSuggestionFormProps {
  onResult?: (result: ProductSuggestionData) => void
}

export function ProductSuggestionForm({
  onResult,
}: ProductSuggestionFormProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ProductSuggestionData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    try {
      const suggestionResult = await generateProductSuggestion(query)
      setResult(suggestionResult)
      onResult?.(suggestionResult)
    } catch (error) {
      console.error("商品提案エラー:", error)
      setResult({
        success: false,
        error: "商品提案の生成に失敗しました。もう一度お試しください。",
        recommendation: "",
        products: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setQuery("")
    setResult(null)
  }

  const exampleQueries = [
    "50インチの有機ELテレビが欲しい。リビングで家族と映画を見るのに使いたい。予算は20万円以内。",
    "ゲーミング用の高性能ノートパソコンを探している。FPSゲームを快適にプレイしたい。予算は15万円前後。",
    "在宅勤務用のワイヤレスヘッドセットが欲しい。長時間の会議でも疲れないもの。予算は2万円以内。",
    "料理用の包丁セットを探している。初心者でも使いやすく、手入れが簡単なもの。予算は1万円以内。",
    "子供用の知育玩具が欲しい。5歳の子供が楽しく学べるもの。予算は5000円以内。",
  ]

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">商品提案結果</h2>
          <Button onClick={handleReset} variant="outline">
            新しい提案を作成
          </Button>
        </div>
        <ProductSuggestionResult result={result} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">AI商品提案</CardTitle>
          <p className="text-gray-600">
            欲しい商品について自由に説明してください。AIがあなたの要求を分析し、最適な商品を提案します。
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium mb-2">
                商品について教えてください
              </label>
              <Textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例：50インチの有機ELテレビが欲しい。リビングで家族と映画を見るのに使いたい。予算は20万円以内。"
                className="min-h-[120px]"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                商品の種類、用途、予算、重要な機能など、詳しく教えてください。
              </p>
            </div>

            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  AI分析中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  商品を提案してもらう
                </>
              )}
            </Button>
          </form>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              例文を参考にしてみてください
            </h3>
            <div className="grid gap-3">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  disabled={isLoading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
