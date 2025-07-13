import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

const MainPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI商品提案サービス
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              あなたの要望をAIが理解し、
              <br className="hidden md:block" />
              Amazon商品から最適な提案をお届けします
            </p>
            <Link href="/suggestion/new">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                商品提案を始める
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            サービスの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">AI分析</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  最先端のAIがあなたの要望を詳細に分析し、
                  最適な商品カテゴリと機能を特定します
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">商品検索</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Amazon.co.jpから評価の高い商品を厳選し、
                  あなたの条件に最も適した商品を見つけます
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl">厳選提案</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AIが厳選した4つの商品を詳細な推薦理由と共に、
                  わかりやすく提案いたします
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ご利用の流れ
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">要望を入力</h3>
              <p className="text-gray-600">
                「動画編集用のノートパソコンが欲しい」など、
                自然な言葉で要望をお聞かせください
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI分析</h3>
              <p className="text-gray-600">
                AIがあなたの要望を分析し、 最適な商品を検索・厳選します
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">提案受取</h3>
              <p className="text-gray-600">
                厳選された商品リストと詳細な推薦理由を わかりやすくお届けします
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              さっそく始めてみましょう
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              あなたの要望をお聞かせください。AIが最適な商品をご提案いたします。
            </p>
            <Link href="/suggestion/new">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                無料で商品提案を受ける
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MainPage
