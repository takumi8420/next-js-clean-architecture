# Requirements Document

## Introduction

このプロジェクトは、Next.jsを使用したチャットアプリケーションで、クリーンアーキテクチャの設計思想に基づいて実装されています。提供されたクリーンアーキテクチャ & DI コーディング規則書に基づいて現在の実装を包括的にレビューし、規則書で定義された原則・パターン・ベストプラクティスとの整合性を評価して、具体的な改善点を特定することが目的です。

## Requirements

### Requirement 1

**User Story:** 開発者として、現在のドメイン層の実装がコーディング規則書で定義されたドメイン層の原則に従っているかを評価したい。そうすることで、ビジネスロジックが適切に分離され、React/Next.js/Prismaに直接依存していないことを確認できる。

#### Acceptance Criteria

1. WHEN ドメインエンティティを分析する THEN エンティティはReact/Next.js/Prismaに直接依存せず、プロパティゲッター（`get id()`）を使用していること
2. WHEN バリューオブジェクトを検証する THEN EmailクラスやBranded Type（UserId等）が適切に実装され、境界の安全性が担保されていること
3. WHEN 時刻依存を確認する THEN Clockインターフェースが定義され、時刻依存のロジックが注入可能になっていること
4. WHEN リポジトリポートを評価する THEN ドメイン層でインターフェースが定義され、戻り値のnullがNotFoundのみに限定されていること
5. WHEN ドメインエラーを検証する THEN DomainError基底クラスとその派生クラス（NotFoundError等）が適切に定義されていること

### Requirement 2

**User Story:** 開発者として、アプリケーション層の実装がコーディング規則書で定義されたフレームワーク非依存の原則に従っているかを確認したい。そうすることで、UseCaseがReact/Next.js/Prismaに直接依存せず、純粋なビジネスロジックの流れを表現していることを保証できる。

#### Acceptance Criteria

1. WHEN ユースケースクラスを分析する THEN UseCaseがReact/Next.js/Prismaに直接依存せず、ドメイン層のポート（インターフェース）のみに依存していること
2. WHEN 依存関係の方向を確認する THEN アプリケーション層がドメイン層に依存し、インフラストラクチャ層に直接依存していないこと
3. WHEN DTOとマッパーを評価する THEN ドメインオブジェクトとDTOの変換が適切に分離され、境界が明確に定義されていること
4. WHEN エラーハンドリングを検証する THEN ドメインエラー（DomainError/NotFoundError等）が適切に処理され、例外またはResult型で表現されていること
5. WHEN ファクトリパターンを確認する THEN 複雑なオブジェクト生成がファクトリクラスで適切に抽象化されていること

### Requirement 3

**User Story:** 開発者として、インフラストラクチャ層の実装がコーディング規則書で定義されたアダプタパターンに従っているかを評価したい。そうすることで、PrismaClientの注入可能性とServer/Client境界の適切な分離が実現されていることを確認できる。

#### Acceptance Criteria

1. WHEN Prismaリポジトリ実装を分析する THEN PrismaClientがコンストラクタで注入され、ドメインポートを正しく実装していること
2. WHEN データマッピングを確認する THEN Prismaのデータベースエンティティとドメインオブジェクト間の変換が適切に行われていること
3. WHEN 外部サービス実装を評価する THEN AuthServiceなどのポートが具象クラス（TokenAuthService等）で適切に実装されていること
4. WHEN ファイル命名を検証する THEN 実装アダプタが技術を接尾辞に含む命名規則（PrismaUserRepository.ts等）に従っていること
5. WHEN Server/Client境界を確認する THEN PrismaアクセスがServer専用で、Client側はHTTPアダプタを使用していること

### Requirement 4

**User Story:** 開発者として、UI層の実装がコーディング規則書で定義されたServer/Client分離とComposition Rootパターンに従っているかを確認したい。そうすることで、Server ComponentとClient Componentが適切に分離され、データ取得方法が正しく実装されていることを保証できる。

#### Acceptance Criteria

1. WHEN Server Componentを分析する THEN ページコンポーネントがserverContainerを使用してUseCaseを直接実行していること
2. WHEN Client Componentを評価する THEN クライアント側コンポーネントがServer Actionsを通じてデータを取得していること
3. WHEN UI Hookを確認する THEN HookがUI層に配置され、Server ActionsまたはHTTPアダプタを使用してデータを取得していること
4. WHEN Composition Rootを検証する THEN Root Layout（app/layout.tsx）がComposition Rootの起点として適切に機能していること
5. WHEN ファイル配置を確認する THEN UIコンポーネントとHookがui/ディレクトリに配置され、app/ディレクトリはNext.js App Routerのみに使用されていること

### Requirement 5

**User Story:** 開発者として、依存関係の注入（DI）がコーディング規則書で定義されたServer/Client境界に基づいて適切に実装されているかを評価したい。そうすることで、serverContainerとclientContainerが正しく分離され、テスタビリティが確保されていることを確認できる。

#### Acceptance Criteria

1. WHEN serverContainerを分析する THEN Prisma実装がバインドされ、サーバ専用のDIコンテナとして機能していること
2. WHEN clientContainerを確認する THEN HTTPアダプタ実装がバインドされ、クライアント専用のDIコンテナとして機能していること
3. WHEN 環境変数による切り替えを評価する THEN USE_PRISMAなどの環境変数でPrisma実装とMock実装が適切に切り替えられること
4. WHEN テスト用DIを検証する THEN テスト時にモック実装を注入可能な設計になっていること
5. WHEN Composition Rootを確認する THEN DIコンテナの生成と依存関係の解決が適切な場所で行われていること

### Requirement 6

**User Story:** 開発者として、コーディング規則書で定義されたテスト戦略と命名規則に基づいて現在の実装を評価し、改善点を特定したい。そうすることで、規則書に準拠した高品質な実装に向けた具体的なアクションプランを得ることができる。

#### Acceptance Criteria

1. WHEN テスト戦略を分析する THEN ユニットテスト（Domain/Application/Infrastructure）と統合テストが規則書の方針に従って実装されていること
2. WHEN 命名規則を確認する THEN ファイル名、クラス名、関数名がPascalCase/camelCase/UPPER_SNAKE_CASEの規則に従っていること
3. WHEN インポート順序を評価する THEN インポート文が規則書で定義された順序（Node標準→外部ライブラリ→domain→application→infrastructure→ui→types→styles）に従っていること
4. WHEN アーキテクチャ違反を特定する THEN 依存関係の方向や層の責任分離に関する違反箇所が明確に指摘されること
5. WHEN 改善提案を作成する THEN 各問題に対する具体的な解決策と実装方法が規則書のパターンに基づいて提示されること
6. WHEN 移行計画を策定する THEN 現在の実装から規則書準拠の実装への移行チェックリストが作成されること