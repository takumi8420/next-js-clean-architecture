# アーキテクチャ違反と改善提案レポート

## 重要度別違反一覧

### Critical（重要度: 10/10）

#### 1. AuthServiceポートと実装の完全欠落

- **違反内容**: 規則書で重要視されているAuthServiceのポートと実装が存在しない
- **影響**: 認証機能が実装できず、セキュリティ要件を満たせない
- **関連ファイル**: `src/domain/services/`（空）、`src/infrastructure/services/`（空）

#### 2. clientContainerの未実装

- **違反内容**: Server/Client DI分離が不完全で、clientContainerが存在しない
- **影響**: クライアント側でのDI原則が適用されず、テスタビリティが低下
- **関連ファイル**: `src/di/clientContainer.ts`（存在しない）

### Major（重要度: 8/10）

#### 3. Prismaスキーマとドメインモデルの不整合

- **違反内容**: ChannelエンティティのisPrivateフィールドがスキーマに存在しない
- **影響**: ドメインロジックとデータベース構造の不一致
- **関連ファイル**: `prisma/schema.prisma`、`src/infrastructure/repositories/PrismaChannelRepository.ts`

#### 4. エンティティでのドメインエラー未使用

- **違反内容**: エンティティ内で`throw new Error()`を使用し、ドメインエラーを使用していない
- **影響**: エラーハンドリングの一貫性欠如
- **関連ファイル**: `src/domain/entities/User.ts`、`src/domain/entities/Channel.ts`、`src/domain/entities/Message.ts`

#### 5. UserRepositoryのsaveメソッド未実装

- **違反内容**: UserRepositoryが読み取り専用で、saveメソッドが未定義
- **影響**: ユーザー情報の更新ができない
- **関連ファイル**: `src/domain/repositories/UserRepository.ts`

### Minor（重要度: 5/10）

#### 6. バリューオブジェクト実装パターンの不統一

- **違反内容**: EmailはクラスベースだがID系はBranded Type
- **影響**: 実装パターンの一貫性欠如
- **関連ファイル**: `src/domain/valueObjects/Email.ts`、`src/domain/valueObjects/UserId.ts`等

#### 7. 時刻依存の不完全な抽象化

- **違反内容**: SendMessageUseCaseで`Date.now()`を直接使用
- **影響**: テスタビリティの低下
- **関連ファイル**: `src/application/useCases/SendMessageUseCase.ts`

#### 8. MessageRepositoryのsave/update分離

- **違反内容**: saveとupdateメソッドが分離されているが、upsertパターンが推奨
- **影響**: 実装の複雑化
- **関連ファイル**: `src/domain/repositories/MessageRepository.ts`

### Info（重要度: 3/10）

#### 9. インポート順序の不統一

- **違反内容**: 規則書で定義された詳細なインポート順序への完全準拠が不完全
- **影響**: コードの可読性とメンテナンス性の軽微な低下
- **関連ファイル**: 複数ファイル

#### 10. 統合テストの不足

- **違反内容**: Prismaリポジトリの統合テストが存在しない
- **影響**: データベース連携の品質保証不足
- **関連ファイル**: `src/__tests__/`

## 違反パターンの分析

### 1. 実装の不完全性

- AuthService、clientContainer等の重要コンポーネントの欠落
- 規則書で定義された機能の部分的実装

### 2. 一貫性の欠如

- エラーハンドリング、バリューオブジェクト実装パターンの不統一
- 命名規則やインポート順序の部分的準拠

### 3. スキーマ設計の問題

- ドメインモデルとデータベーススキーマの不整合
- 必要フィールドの欠落

## 根本原因分析

### 1. 段階的実装による不完全性

- プロジェクトが段階的に実装されており、一部機能が未実装
- 規則書の全要件への対応が不完全

### 2. 設計方針の不統一

- 実装パターンの選択基準が不明確
- チーム内での規則書理解の差異

### 3. テスト戦略の不完全性

- 統合テストレベルでの品質保証が不足
- E2Eテストによる全体動作確認の欠如
