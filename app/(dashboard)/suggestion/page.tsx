import { SuggestionHistoryList } from "@/components/product-suggestion/SuggestionHistoryList"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import Link from "next/link"

export default function SuggestionPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI商品提案</h1>
          <p className="text-gray-600 mt-1">
            過去の提案履歴を確認するか、新しい提案を作成しましょう
          </p>
        </div>
        <Link href="/suggestion/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            新しい提案を作成
            <Sparkles className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <SuggestionHistoryList />
    </div>
  )
}

export const metadata = {
  title: "AI商品提案 - 履歴 | Amazon Product Recommendations",
  description: "AI商品提案の履歴を確認し、新しい提案を作成できます",
}
