# cc-v0
共創DAOでの共助アプリ(M2)のプロトタイプ

## 環境変数の設定

```shell
$ cp .env.example .env.local
```

以下の値をメンバーに確認してから、更新してください
```shell
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-project-id
```

## アプリケーションの依存関係をインストール
```shell
$ yarn
```

## ローカルサーバーを立ち上げる
```shell
$ yarn dev
```

## その他
- Database / Storage / API を [Supabase](https://supabase.com/) を使っています
- 簡易実装のため、Database を local / production で現時点で分けていないので、注意してください

### 型の生成
- Supabase のスキーマから TypeScript の型を生成します
```
$ yarn run gen:types
```
