# Next.js Clean Architecture - Slack Clone

Next.js 15とクリーンアーキテクチャを使用したSlack風チャットアプリケーションです。

## 目次

- [概要](#概要)
- [アーキテクチャ](#アーキテクチャ)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [テスト](#テスト)
- [ディレクトリ構造](#ディレクトリ構造)
- [コーディング規則](#コーディング規則)

## 概要

このプロジェクトは、クリーンアーキテクチャの原則に従って構築されたSlack風のチャットアプリケーションです。現在はモックデータで動作するフロントエンドのみの実装となっています。

### 主な機能

- チャンネル一覧の表示
- チャンネル内のメッセージ表示
- メッセージの送信
- ユーザーステータスの表示

## アーキテクチャ

### クリーンアーキテクチャの原則

1. **依存性の方向**: 外側（UI/Infrastructure）から内側（Domain）へのみ依存
2. **フレームワーク非依存**: Domain層とApplication層はReact/Next.jsに依存しない
3. **テスタビリティ**: 各層が独立してテスト可能
4. **柔軟性**: インフラ層の実装を容易に切り替え可能

### レイヤー構成

```
┌─────────────────────────────────────────┐
│ UI Layer (Pages, Components, Hooks)     │
├─────────────────────────────────────────┤
│ Application Layer (Use Cases)           │
├─────────────────────────────────────────┤
│ Domain Layer (Entities, Value Objects,  │
│              Repository Interfaces)      │
├─────────────────────────────────────────┤
│ Infrastructure Layer (Repositories,     │
│                      External Services)  │
└─────────────────────────────────────────┘
```

## 技術スタック

- **フレームワーク**: Next.js 15.4.6 (App Router)
- **言語**: TypeScript 5
- **UI**: React 19.1.0
- **スタイリング**: Tailwind CSS 4
- **テスト**: Jest, React Testing Library
- **コード品質**: ESLint, Prettier
- **アーキテクチャ**: Clean Architecture, Dependency Injection

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/takumi8420/next-js-clean-architecture.git
cd next-js-clean-architecture

# 依存関係のインストール
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

### ビルド

```bash
npm run build
```

### プロダクション実行

```bash
npm run start
```

### コードフォーマット

```bash
# コードの自動フォーマット
npm run format

# フォーマットチェックのみ
npm run format:check
```

### リント

```bash
npm run lint
```

## テスト

### テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードでテストを実行（開発中推奨）
npm run test:watch

# カバレッジレポート付きでテストを実行
npm run test:coverage
```

### テスト構成

- **ユニットテスト**: ドメイン層、アプリケーション層のビジネスロジック
- **コンポーネントテスト**: UIコンポーネントの振る舞い
- **モック**: 外部依存をモック化して独立したテストを実現

### テストカバレッジ

現在のテストカバレッジ:
- Domain層: 100%
- Application層: 100%
- UI層: 部分的（主要コンポーネントのみ）

## ディレクトリ構造

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ホームページ（リダイレクト）
│   └── channels/                # チャンネル関連ページ
│       ├── layout.tsx
│       └── [id]/
│           └── page.tsx
├── domain/                      # ドメイン層
│   ├── entities/               # エンティティ
│   │   ├── User.ts
│   │   ├── Channel.ts
│   │   └── Message.ts
│   ├── valueObjects/           # 値オブジェクト
│   │   ├── UserId.ts
│   │   ├── ChannelId.ts
│   │   ├── MessageId.ts
│   │   └── Email.ts
│   ├── repositories/           # リポジトリインターフェース
│   └── time/                   # 時刻関連
│       └── Clock.ts
├── application/                # アプリケーション層
│   └── useCases/              # ユースケース
│       ├── GetChannelsUseCase.ts
│       ├── GetMessagesByChannelUseCase.ts
│       └── SendMessageUseCase.ts
├── infrastructure/            # インフラストラクチャ層
│   └── repositories/          # リポジトリ実装
│       ├── MockUserRepository.ts
│       ├── MockChannelRepository.ts
│       └── MockMessageRepository.ts
├── ui/                        # UI層
│   ├── components/           # コンポーネント
│   │   ├── common/          # 共通コンポーネント
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── features/        # 機能別コンポーネント
│   │       ├── channels/
│   │       │   └── Sidebar.tsx
│   │       └── messages/
│   │           ├── MessageList.tsx
│   │           ├── MessageItem.tsx
│   │           └── MessageInput.tsx
│   └── hooks/               # カスタムフック
│       ├── useChannels.ts
│       ├── useMessages.ts
│       └── useSendMessage.ts
├── di/                        # 依存性注入
│   └── clientContainer.ts
├── mock/                      # モックデータ
│   └── data.ts
└── __tests__/                # テストファイル
    ├── domain/
    ├── application/
    └── ui/
```

## コーディング規則

詳細なコーディング規則は [document.md](./document.md) を参照してください。

### 主な規則

1. **命名規則**
   - コンポーネント: PascalCase
   - フック: camelCase（use接頭辞）
   - ファイル名: コンポーネントと同名

2. **型定義**
   - 厳密な型定義を使用
   - Value ObjectsとBranded Typesで型安全性を強化

3. **依存性の方向**
   - 内側のレイヤーは外側のレイヤーに依存しない
   - インターフェースを介した依存性の注入

4. **テスト**
   - 各レイヤーで適切なテストを実装
   - モックを使用して依存性を隔離

## 今後の拡張予定

- [ ] バックエンドAPIの実装
- [ ] リアルタイム通信（WebSocket）
- [ ] ユーザー認証機能
- [ ] ファイルアップロード機能
- [ ] 絵文字リアクション
- [ ] スレッド機能
- [ ] 検索機能

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。