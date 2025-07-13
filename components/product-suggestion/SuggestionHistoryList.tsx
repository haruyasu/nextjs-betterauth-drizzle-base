"use client"

import {
  type SuggestionHistoryItem,
  deleteSuggestion,
  getSuggestionHistory,
} from "@/actions/suggestion-history-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import {
  AlertTriangle,
  Clock,
  Eye,
  Package,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SuggestionHistoryListProps {
  onRefresh?: () => void
}

export function SuggestionHistoryList({
  onRefresh,
}: SuggestionHistoryListProps) {
  const [suggestions, setSuggestions] = useState<SuggestionHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    try {
      setLoading(true)
      const data = await getSuggestionHistory()
      setSuggestions(data)
    } catch (error) {
      console.error("履歴取得エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteSuggestion(id)
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
      onRefresh?.()
    } catch (error) {
      console.error("削除エラー:", error)
      alert("削除に失敗しました")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            提案履歴がありません
          </h3>
          <p className="text-gray-500 mb-6">
            新しい商品提案を作成して、履歴を確認しましょう
          </p>
          <Link href="/suggestion/new">
            <Button>
              <Search className="h-4 w-4 mr-2" />
              新しい提案を作成
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">商品提案履歴</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShoppingBag className="h-4 w-4" />
          <span>{suggestions.length}件の提案</span>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* 質問内容 */}
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-2 leading-relaxed">
                      {suggestion.query}
                    </p>
                  </div>

                  {/* メタ情報 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(suggestion.createdAt), "yyyy/MM/dd")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{suggestion.productCount}件の商品</span>
                    </div>

                    {suggestion.firstProductTitle && (
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4" />
                        <span className="truncate max-w-48">
                          {suggestion.firstProductTitle}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ステータス */}
                  <div>
                    <Badge
                      variant={
                        suggestion.productCount > 0 ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {suggestion.productCount > 0 ? "提案完了" : "商品なし"}
                    </Badge>
                  </div>
                </div>

                {/* アクション */}
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/suggestion/${suggestion.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      詳細
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === suggestion.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          提案を削除しますか？
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          この提案を削除すると、関連するデータもすべて削除されます。
                          この操作は元に戻すことができません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(suggestion.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          削除する
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
