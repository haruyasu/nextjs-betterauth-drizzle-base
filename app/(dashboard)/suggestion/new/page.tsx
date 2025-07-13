import { ProductSuggestionForm } from "@/components/product-suggestion/ProductSuggestionForm"

export const metadata = {
  title: "新しい商品提案 | AI Amazon Product Recommendations",
  description: "AIがあなたの要求を分析し、最適な商品を提案します",
}

export default function NewSuggestionPage() {
  return (
    <div className="container mx-auto p-6">
      <ProductSuggestionForm />
    </div>
  )
}
