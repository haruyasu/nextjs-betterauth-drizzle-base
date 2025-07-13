import { getSuggestionDetail } from "@/actions/suggestion-history-actions"
import { ProductSuggestionResult } from "@/components/product-suggestion/ProductSuggestionResult"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ArrowLeft, Calendar, MessageSquare, Package } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface SuggestionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SuggestionDetailPage({
  params,
}: SuggestionDetailPageProps) {
  const { id } = await params
  const suggestion = await getSuggestionDetail(id)

  if (!suggestion) {
    notFound()
  }

  // 保存されたデータをそのまま使用
  const result = {
    requirements: suggestion.analysis.requirements,
    searchKeyword: suggestion.analysis.searchKeyword,
    recommendation: suggestion.analysis.recommendation,
    products: suggestion.productData,
    success: suggestion.success,
  }

  return (
    <div className="container mx-auto p-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">提案詳細</h1>
          <p className="text-gray-600 mt-1">
            過去の提案内容と推薦商品の詳細を確認できます
          </p>
        </div>
      </div>

      {/* 提案情報 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            あなたの要求
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900 leading-relaxed mb-4">
            {suggestion.query}
          </p>

          {/* メタ情報 */}
          <div className="flex items-center gap-6 text-sm text-gray-500 border-t pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(suggestion.createdAt), "yyyy/MM/dd")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{suggestion.productData.length}件の商品</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 提案結果 */}
      <ProductSuggestionResult result={result} />
    </div>
  )
}

export async function generateMetadata({ params }: SuggestionDetailPageProps) {
  const { id } = await params
  const suggestion = await getSuggestionDetail(id)

  if (!suggestion) {
    return {
      title: "提案が見つかりません",
    }
  }

  return {
    title: `提案詳細 - ${suggestion.query.slice(0, 50)}... | AI商品提案`,
    description: `${suggestion.query.slice(
      0,
      100
    )}...の詳細な提案結果を確認できます`,
  }
}
