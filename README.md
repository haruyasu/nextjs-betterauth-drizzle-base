# Base App

Next.js + BetterAuth + Drizzle ORM を使用した認証機能のベースアプリケーション

## 技術スタック

- **Next.js 15** - React フレームワーク
- **BetterAuth** - 認証ライブラリ
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - データベース
- **Tailwind CSS** - スタイリング
- **TypeScript** - 型安全性

## セットアップ

1. 依存関係のインストール

```bash
yarn install
```

2. 環境変数の設定

```bash
cp .env.example .env.local
```

3. データベースのセットアップ

```bash
yarn db:generate
yarn db:migrate
```

4. 開発サーバーの起動

```bash
yarn dev
```
