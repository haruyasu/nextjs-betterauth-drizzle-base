// import { getSessionCookie } from "better-auth/cookies"
// import { type NextRequest, NextResponse } from "next/server"
import { NextResponse } from "next/server"

// export async function middleware(request: NextRequest) {
export async function middleware() {
  // const { pathname } = request.nextUrl

  // ダッシュボードへのアクセス制御 - ログインしていないユーザーをリダイレクト
  // if (pathname.startsWith("/dashboard")) {
  //   const cookies = getSessionCookie(request)
  //   if (!cookies) {
  //     return NextResponse.redirect(new URL("/login", request.url))
  //   }
  // }

  // ルートドメインでは通常のアクセスを許可
  return NextResponse.next()
}

// ミドルウェアを適用するURLパス
export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * 1. /api ルート
     * 2. /_next (Next.jsの内部ファイル)
     * 3. /examples (/publicの中)
     * 4. /publicの中のすべてのルートファイル（例: /favicon.ico）
     */
    "/((?!api|_next|examples|[\\w-]+\\.\\w+).*)",
  ],
}
