# Amazon AI 商品レコメンド アプリ

Rainforest API と OpenAI API を使用した、Amazon 商品レコメンドチャットアプリケーションです。

## 機能

- **チャット機能**: ChatGPT ライクな UI で自然な会話
- **商品検索**: Rainforest API を使用した Amazon 商品検索
- **AI レコメンド**: OpenAI API を使用した商品分析・推薦
- **セッション管理**: チャット履歴の保存・管理
- **レスポンシブデザイン**: shadcn/ui を使用したモダンな UI

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Server Actions, PostgreSQL, Drizzle ORM
- **Auth**: Better Auth
- **UI**: shadcn/ui, Tailwind CSS
- **APIs**: OpenAI API, Rainforest API

## セットアップ

### 1. 依存関係のインストール

```bash
yarn install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/database_name

# Auth
BETTER_AUTH_SECRET=your-secret-key-here

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Rainforest API
RAINFOREST_API_KEY=your-rainforest-api-key-here
```

### 3. データベースの設定

```bash
# マイグレーションファイルの生成
yarn db:generate

# データベースマイグレーション
yarn db:migrate
```

### 4. 開発サーバーの起動

```bash
yarn dev
```

## 使用方法

1. アプリケーションにログイン
2. 「チャット」ボタンをクリックしてダッシュボード画面に移動
3. 「新しいチャット」ボタンで新しいセッションを作成
4. 商品について質問する（例：「50 インチの有機 EL テレビが欲しい」）
5. AI が Amazon 商品を検索し、最適な商品を推薦

## API キーの取得

### OpenAI API

- [OpenAI Platform](https://platform.openai.com/)でアカウントを作成
- API keys セクションで API キーを生成

### Rainforest API

- [Rainforest API](https://docs.trajectdata.com/rainforestapi/)でアカウントを作成
- ダッシュボードで API キーを取得

## 開発

### データベースコマンド

```bash
# スキーマの生成
yarn db:generate

# マイグレーション実行
yarn db:migrate

# データベースを直接更新
yarn db:push

# Drizzle Studio起動
yarn db:studio
```

### コード品質

```bash
# リンター実行
yarn lint

# ビルド
yarn build
```

## 構造

```
├── actions/                 # Server Actions
│   ├── chat-actions.ts      # チャット関連アクション
│   ├── product-actions.ts   # 商品検索アクション
│   └── recommendation-actions.ts # レコメンドアクション
├── app/                     # Next.js App Router
│   ├── (dashboard)/
│   │   └── dashboard/      # ダッシュボード・チャット画面
├── components/
│   ├── dashboard/          # ダッシュボード用コンポーネント
│   └── ui/                 # shadcn/ui コンポーネント
├── lib/
│   ├── auth.ts             # 認証設定
│   └── db/                 # データベース設定
└── schemas/                # Zodバリデーションスキーマ
```
