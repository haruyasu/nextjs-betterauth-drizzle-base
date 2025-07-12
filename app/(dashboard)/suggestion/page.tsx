import { ProductSuggestionForm } from "@/components/product-suggestion/ProductSuggestionForm"

export default function SuggestionPage() {
  return (
    <div className="container mx-auto p-6">
      <ProductSuggestionForm />
    </div>
  )
}

export const metadata = {
  title: "AI商品提案 - Amazon Product Recommendations",
  description: "AIがあなたの要求を分析し、最適な商品を提案します",
}
