# 段階的移行チェックリスト

## Phase 1: Critical Issues対応（即座に実施）

### 1.1 AuthService実装

- [ ] **1.1.1** `src/domain/services/AuthService.ts`インターフェース作成
  - register, login, logout, getCurrentUserId, validateTokenメソッド定義
  - 型安全性確保
  - JSDocコメント追加

- [ ] **1.1.2** `src/infrastructure/services/TokenAuthService.ts`実装作成
  - AuthServiceインターフェース実装
  - JWT/NextAuth.js連携検討
  - パスワードハッシュ化実装
  - エラーハンドリング追加

- [ ] **1.1.3** serverContainerにAuthService追加
  - TokenAuthServiceインスタンス生成
  - 依存関係注入設定
  - 環境変数による切り替え対応

### 1.2 Prismaスキーマ修正

- [ ] **1.2.1** Channelモデル修正

  ```prisma
  model Channel {
    isPrivate Boolean @default(false) // 追加
  }
  ```

- [ ] **1.2.2** Messageモデル修正

  ```prisma
  model Message {
    updatedAt DateTime? // 追加
  }
  ```

- [ ] **1.2.3** マイグレーション実行

  ```bash
  npx prisma migrate dev --name add-missing-fields
  npx prisma generate
  ```

- [ ] **1.2.4** PrismaChannelRepository修正
  - isPrivateフィールドのハードコード削除
  - データベースからの値使用に変更

### 1.3 エンティティでのドメインエラー使用

- [ ] **1.3.1** User.tsエラーハンドリング修正
  - `throw new Error()` → `throw new ValidationError()`
  - updateName, updateStatusメソッド修正

- [ ] **1.3.2** Channel.tsエラーハンドリング修正
  - updateName, updateDescriptionメソッド修正
  - ValidationErrorの適切な使用

- [ ] **1.3.3** Message.tsエラーハンドリング修正
  - updateContentメソッド修正
  - エラーメッセージの統一

## Phase 2: Major Issues対応（1-2週間以内）

### 2.1 clientContainer実装

- [ ] **2.1.1** HTTPアダプタリポジトリ作成
  - `src/infrastructure/repositories/HttpChannelRepository.ts`
  - `src/infrastructure/repositories/HttpMessageRepository.ts`
  - `src/infrastructure/repositories/HttpUserRepository.ts`

- [ ] **2.1.2** `src/di/clientContainer.ts`作成
  - HTTPアダプタを使用したDIコンテナ
  - 'use client'ディレクティブ追加
  - 型安全性確保

- [ ] **2.1.3** API Routes作成
  - `/api/channels`エンドポイント
  - `/api/messages`エンドポイント
  - `/api/users`エンドポイント

### 2.2 UserRepository完全実装

- [ ] **2.2.1** IUserRepositoryインターフェース拡張
  - saveメソッド追加
  - deleteメソッド追加

- [ ] **2.2.2** PrismaUserRepository実装拡張
  - saveメソッド実装（upsertパターン）
  - deleteメソッド実装

- [ ] **2.2.3** MockUserRepository実装拡張
  - saveメソッド実装
  - deleteメソッド実装

### 2.3 統合テスト追加

- [ ] **2.3.1** テスト環境セットアップ
  - TEST_DATABASE_URL設定
  - テスト用Prismaクライアント設定

- [ ] **2.3.2** Prismaリポジトリ統合テスト作成
  - `src/__tests__/integration/PrismaUserRepository.integration.test.ts`
  - `src/__tests__/integration/PrismaChannelRepository.integration.test.ts`
  - `src/__tests__/integration/PrismaMessageRepository.integration.test.ts`

## Phase 3: Minor Issues対応（1ヶ月以内）

### 3.1 バリューオブジェクト統一

- [ ] **3.1.1** 実装パターン決定
  - クラスベース vs Branded Type
  - チーム内合意形成

- [ ] **3.1.2** 選択パターンでの統一実装
  - 全バリューオブジェクト修正
  - equalsメソッド追加（クラスベースの場合）

- [ ] **3.1.3** 既存コード修正
  - エンティティでの使用箇所修正
  - テストコード修正

### 3.2 時刻・ID生成抽象化

- [ ] **3.2.1** IdGeneratorサービス作成
  - `src/domain/services/IdGenerator.ts`インターフェース
  - `src/infrastructure/services/UuidIdGenerator.ts`実装

- [ ] **3.2.2** SendMessageUseCase修正
  - IdGenerator依存関係追加
  - Date.now()直接使用削除

- [ ] **3.2.3** DIコンテナ修正
  - IdGeneratorインスタンス追加
  - 依存関係注入設定

### 3.3 コード品質改善

- [ ] **3.3.1** ESLintルール設定
  - インポート順序ルール追加
  - 命名規則ルール追加

- [ ] **3.3.2** 既存コード修正
  - インポート順序統一
  - リンターエラー修正

## Phase 4: 長期的改善（継続的実施）

### 4.1 テスト拡充

- [ ] **4.1.1** UIコンポーネントテスト
  - React Testing Library導入
  - 主要コンポーネントのテスト作成

- [ ] **4.1.2** E2Eテスト導入
  - Playwright/Cypress選定
  - 主要ユーザーフローのテスト作成

### 4.2 パフォーマンス最適化

- [ ] **4.2.1** データベースクエリ最適化
  - N+1問題解決
  - インデックス最適化

- [ ] **4.2.2** フロントエンド最適化
  - コード分割
  - 画像最適化

## リスク評価と対策

### 高リスク項目

1. **Prismaスキーマ変更**
   - **リスク**: 既存データの破損
   - **対策**: 本番環境での慎重なマイグレーション、バックアップ取得

2. **認証システム実装**
   - **リスク**: セキュリティ脆弱性
   - **対策**: セキュリティレビュー実施、既存ライブラリ活用

### 中リスク項目

1. **大規模リファクタリング**
   - **リスク**: 既存機能の破損
   - **対策**: 段階的実装、十分なテスト実施

2. **API変更**
   - **リスク**: フロントエンドとの不整合
   - **対策**: API仕様書作成、バージョニング

## 成功指標

### Phase 1完了時

- [ ] 全Critical違反の解決
- [ ] 既存機能の正常動作確認
- [ ] 新規テストの追加（最低10件）

### Phase 2完了時

- [ ] Server/Client DI分離完了
- [ ] 統合テストカバレッジ80%以上
- [ ] API エンドポイント完全実装

### Phase 3完了時

- [ ] コード品質メトリクス改善
- [ ] 技術的負債50%削減
- [ ] 開発効率向上（ビルド時間短縮等）

### Phase 4完了時

- [ ] E2Eテストカバレッジ主要フロー100%
- [ ] パフォーマンス指標改善
- [ ] 保守性指標向上

## 実装チェックポイント

### 各Phase開始前

- [ ] 要件確認とチーム合意
- [ ] 技術調査完了
- [ ] 実装計画詳細化

### 各Phase完了時

- [ ] 機能テスト実施
- [ ] コードレビュー完了
- [ ] ドキュメント更新
- [ ] 次Phase準備完了
