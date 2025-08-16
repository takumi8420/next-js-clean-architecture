# Design Document

## Overview

このドキュメントでは、Next.jsチャットアプリケーションの現在の実装をクリーンアーキテクチャ & DI コーディング規則書に基づいて包括的にレビューするための設計を定義します。レビューは6つの主要な観点から実施され、各観点で規則書との整合性を評価し、具体的な改善点を特定します。

## Architecture

### レビュー対象アーキテクチャの現状分析

現在のプロジェクト構造：
```
src/
├── app/                    # Next.js App Router
├── ui/                     # UI層（React依存）
├── application/            # アプリケーション層
├── domain/                 # ドメイン層
├── infrastructure/         # インフラストラクチャ層
├── di/                     # 依存性注入
├── mock/                   # モックデータ
└── __tests__/              # テスト
```

### レビュー実施アプローチ

1. **静的分析**: ファイル構造、インポート関係、命名規則の評価
2. **依存関係分析**: 各層間の依存関係の方向性と適切性の検証
3. **実装パターン分析**: 規則書で定義されたパターンとの比較
4. **ギャップ分析**: 現在の実装と規則書の理想形との差異特定
5. **改善提案**: 具体的な修正方法と実装例の提示

## Components and Interfaces

### 1. ドメイン層レビューコンポーネント

**DomainLayerAnalyzer**
- エンティティの外部フレームワーク依存性チェック
- バリューオブジェクトの実装パターン検証
- Clockインターフェースの存在と使用状況確認
- リポジトリポートの定義と戻り値パターン検証
- ドメインエラーの階層構造確認

**検証項目:**
- Entity: プロパティゲッター使用、フレームワーク非依存
- Value Objects: Email/Branded Type実装、不変性保証
- Clock: インターフェース定義、時刻依存の注入可能性
- Repository Ports: インターフェース定義、null戻り値の適切性
- Domain Errors: DomainError基底クラス、派生クラス構造

### 2. アプリケーション層レビューコンポーネント

**ApplicationLayerAnalyzer**
- UseCaseのフレームワーク非依存性検証
- 依存関係の方向性確認
- DTO/Mapperの境界分離評価
- エラーハンドリングパターン検証
- ファクトリパターンの使用状況確認

**検証項目:**
- UseCase: React/Next.js/Prisma非依存、ポート依存のみ
- 依存関係: ドメイン層への依存、インフラ層への直接依存回避
- DTO/Mapper: 境界の明確性、変換の適切性
- Error Handling: ドメインエラーの処理、例外/Result型の使用
- Factory Pattern: 複雑なオブジェクト生成の抽象化

### 3. インフラストラクチャ層レビューコンポーネント

**InfrastructureLayerAnalyzer**
- Prismaリポジトリの実装パターン検証
- データマッピングの適切性確認
- 外部サービス実装の抽象化評価
- ファイル命名規則の準拠確認
- Server/Client境界の分離検証

**検証項目:**
- Prisma Repository: PrismaClient注入、ポート実装
- Data Mapping: ドメインオブジェクト変換の適切性
- External Services: AuthService等のポート実装
- File Naming: 技術接尾辞命名規則（PrismaXxxRepository.ts）
- Server/Client Boundary: Prismaサーバ専用、HTTPアダプタ使用

### 4. UI層レビューコンポーネント

**UILayerAnalyzer**
- Server/Client Component分離の検証
- データ取得方法の適切性確認
- UI Hookの配置と実装評価
- Composition Rootパターンの確認
- ファイル配置規則の準拠検証

**検証項目:**
- Server Components: serverContainer使用、UseCase直接実行
- Client Components: Server Actions使用、データ取得方法
- UI Hooks: ui/配置、Server Actions/HTTPアダプタ使用
- Composition Root: app/layout.tsx機能、起点としての役割
- File Placement: ui/ディレクトリ配置、app/ディレクトリ用途

### 5. 依存性注入レビューコンポーネント

**DIAnalyzer**
- Server/Client DIコンテナの分離検証
- 環境変数による実装切り替え確認
- テスト用DI設計の評価
- Composition Rootの適切性確認

**検証項目:**
- Server Container: Prisma実装バインド、サーバ専用機能
- Client Container: HTTPアダプタ実装、クライアント専用機能
- Environment Switching: USE_PRISMA等による実装切り替え
- Test DI: モック実装注入可能性
- Composition Root: DI生成と依存解決の場所

### 6. テスト戦略・命名規則レビューコンポーネント

**QualityAssuranceAnalyzer**
- テスト戦略の規則書準拠確認
- 命名規則の一貫性検証
- インポート順序の規則準拠確認
- アーキテクチャ違反の特定
- 改善提案の優先度付け

**検証項目:**
- Test Strategy: ユニット/統合テストの実装状況
- Naming Convention: PascalCase/camelCase/UPPER_SNAKE_CASE準拠
- Import Order: 規定順序（Node→外部→domain→application→infrastructure→ui→types→styles）
- Architecture Violations: 依存関係方向、層責任分離の違反
- Improvement Proposals: 具体的解決策、移行チェックリスト

## Data Models

### レビュー結果データモデル

```typescript
interface ReviewResult {
  category: ReviewCategory;
  severity: 'critical' | 'major' | 'minor' | 'info';
  title: string;
  description: string;
  currentImplementation: string;
  expectedImplementation: string;
  improvementSuggestion: string;
  codeExample?: string;
  relatedFiles: string[];
  priority: number;
}

interface CategoryReviewSummary {
  category: ReviewCategory;
  totalIssues: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  complianceScore: number; // 0-100
  recommendations: string[];
}

interface OverallReviewReport {
  projectOverview: string;
  categoryResults: CategoryReviewSummary[];
  detailedFindings: ReviewResult[];
  migrationChecklist: MigrationItem[];
  prioritizedActionPlan: ActionItem[];
}
```

### 分析対象データモデル

```typescript
interface ProjectStructure {
  directories: DirectoryInfo[];
  files: FileInfo[];
  dependencies: DependencyGraph;
  importRelationships: ImportRelationship[];
}

interface FileInfo {
  path: string;
  type: 'entity' | 'valueObject' | 'useCase' | 'repository' | 'component' | 'other';
  layer: 'domain' | 'application' | 'infrastructure' | 'ui';
  imports: string[];
  exports: string[];
  violations: string[];
}

interface DependencyGraph {
  nodes: string[];
  edges: DependencyEdge[];
  violations: DependencyViolation[];
}
```

## Error Handling

### レビュープロセスのエラーハンドリング

1. **ファイル読み取りエラー**
   - 存在しないファイルの参照
   - アクセス権限の問題
   - 対処: エラーログ記録、スキップして継続

2. **構文解析エラー**
   - TypeScriptコードの構文エラー
   - インポート文の解析失敗
   - 対処: 部分的解析、手動確認推奨

3. **依存関係解析エラー**
   - 循環依存の検出
   - 未解決の依存関係
   - 対処: 警告として報告、グラフ可視化

4. **規則適用エラー**
   - 規則の解釈の曖昧性
   - 例外的なケースの処理
   - 対処: 人間による判断を推奨

### レビュー結果の信頼性確保

- **多角的検証**: 複数の分析手法による結果の照合
- **段階的レビュー**: 自動分析→手動確認→専門家レビュー
- **継続的改善**: レビュー結果のフィードバックによる分析精度向上

## Testing Strategy

### レビュー実施のテスト戦略

1. **分析ツールのテスト**
   - 各アナライザーの単体テスト
   - 既知の違反パターンでの検証
   - 偽陽性・偽陰性の最小化

2. **レビュー結果の検証**
   - サンプルプロジェクトでの事前テスト
   - 規則書準拠プロジェクトとの比較
   - 専門家による結果の妥当性確認

3. **改善提案の実証**
   - 提案された修正の実装テスト
   - 修正前後の品質メトリクス比較
   - 実装コストと効果の評価

### 品質保証プロセス

1. **自動化された検証**
   - 静的解析ツールによる基本チェック
   - 依存関係グラフの自動生成
   - 命名規則の機械的検証

2. **人間による検証**
   - アーキテクチャ設計の妥当性評価
   - ビジネスロジックの適切性確認
   - 実装パターンの最適性判断

3. **継続的改善**
   - レビュー結果の追跡
   - 改善実施後の再評価
   - 学習内容の次回レビューへの反映

この設計に基づいて、現在のNext.jsチャットアプリケーションの実装を体系的にレビューし、クリーンアーキテクチャ & DI コーディング規則書への準拠度を評価します。各カテゴリーで特定された問題に対して、具体的な改善提案と実装例を提供し、段階的な移行計画を策定します。