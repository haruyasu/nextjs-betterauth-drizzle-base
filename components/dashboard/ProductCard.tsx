"use client"

import { ExternalLink, Star, ShoppingCart, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Product {
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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const handleViewProduct = () => {
    if (product.link) {
      window.open(product.link, "_blank", "noopener,noreferrer")
    } else {
      // リンクが存在しない場合の処理
      alert("商品リンクが存在しません")
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 leading-tight">
            {product.title || "タイトル不明"}
          </CardTitle>
          {product.is_prime && (
            <Badge variant="secondary" className="ml-2 flex-shrink-0">
              <Crown className="h-3 w-3 mr-1" />
              Prime
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 商品画像 */}
        <div className="flex justify-center">
          <Image
            width={128}
            height={128}
            src={product.image || "/noImage.png"}
            alt={product.title || "商品画像"}
            className="w-32 h-32 object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/noImage.png"
            }}
          />
        </div>

        {/* 価格表示 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {product.price?.raw || "価格不明"}
          </div>
        </div>

        {/* 評価表示 */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-medium">{product.rating || "N/A"}</span>
          </div>
          <span className="text-sm text-gray-500">
            ({(product.ratings_total || 0).toLocaleString()}件)
          </span>
        </div>

        {/* 商品情報 */}
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">ASIN:</span> {product.asin || "N/A"}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleViewProduct}
            className="flex-1"
            variant="default"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Amazonで見る
          </Button>
          <Button onClick={handleViewProduct} variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
