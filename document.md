ご指摘もっともです。前回は要点に絞ったため、確かに情報量が落ちていました。ここで**元ドキュメントの粒度を維持**しつつ、指摘事項をすべて反映した\*\*完全版（修正版）\*\*を提示します。

---

# Next.js クリーンアーキテクチャ & DI コーディング規則書（完全修正版）

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [レイヤー別実装ガイド](#レイヤー別実装ガイド)
4. [依存性注入の実装（サーバ／クライアント境界）](#依存性注入の実装サーバクライアント境界)
5. [テスト戦略](#テスト戦略)
6. [コーディング規則](#コーディング規則)
7. [実装例](#実装例)
8. [まとめ](#まとめ)

---

## アーキテクチャ概要

### 基本原則

* **依存性の方向**: 外側（UI/Infra）→ 内側（Application → Domain）へのみ依存
* **フレームワーク非依存**: Domain と Application は React/Next/Prisma を直接知らない
* **Server/Client 境界の厳守**: DBアクセス（Prisma）は**サーバ専用**、クライアントはHTTP/Server Action経由
* **DIによる実装差し替え**: 同一ポート（インターフェース）に対し、Prisma実装（Server）とHTTP実装（Client）を差し替え
* **テスタビリティ**: 時計や外部I/Oはポート化して注入、純粋ロジックをユニットで検証
* **型安全**: Value Object（VO）とBranded Typeで境界の安全性を強化

### レイヤー構成

```
┌──────────────────────────────────────────────┐
│ UI Layer (Pages, Components, UI Hooks)         │
│  - Next.js App Router (Server/Client 分離)       │
├──────────────────────────────────────────────┤
│ Application Layer (UseCases, DTOs, Mappers)    │
│  - React/Prisma非依存                           │
├──────────────────────────────────────────────┤
│ Domain Layer (Entities, VOs, Domain Services,  │
│              Ports[Repositories/Services],     │
│              Errors, Clock)                    │
├──────────────────────────────────────────────┤
│ Infrastructure Layer (Adapters)                │
│  - Server: Prisma, External SDKs               │
│  - Client: HTTP/Server Action Adapters         │
└──────────────────────────────────────────────┘
```

---

## ディレクトリ構造

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Server Component（Composition Rootの一部）
│   └── users/
│       └── [id]/page.tsx         # Server ComponentでUseCase実行
├── ui/                           # UI層（React依存OK）
│   ├── components/
│   │   └── features/users/UserProfileView.tsx
│   └── hooks/
│       └── useUserProfile.ts     # UI専用Hook（UseCase呼び出し）
├── application/                  # フレームワーク非依存
│   ├── useCases/
│   │   ├── GetUserProfileUseCase.ts
│   │   └── RegisterUserUseCase.ts
│   ├── dto/
│   └── mappers/
├── domain/                       # ビジネスルール
│   ├── entities/
│   │   └── User.ts
│   ├── valueObjects/
│   │   ├── Email.ts
│   │   └── UserId.ts
│   ├── repositories/             # ポート
│   │   └── UserRepository.ts
│   ├── services/                 # ポート
│   │   └── AuthService.ts
│   ├── time/
│   │   └── Clock.ts              # 時刻ポート
│   └── errors/
│       ├── DomainError.ts
│       └── NotFoundError.ts
├── infrastructure/               # アダプタ（実装）
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── client.ts
│   ├── repositories/
│   │   └── PrismaUserRepository.ts
│   ├── http/
│   │   ├── HttpUserRepository.ts
│   │   └── routes.ts             # API Route / Server Action
│   └── services/
│       └── TokenAuthService.ts
├── di/
│   ├── serverContainer.ts        # サーバ専用DI
│   └── clientContainer.ts        # クライアント専用DI（HTTP実装）
├── lib/
├── types/
└── __tests__/
```

---

## レイヤー別実装ガイド

### 1. Domain層

#### Value Objects

```ts
// domain/valueObjects/Email.ts
export class Email {
  private readonly value: string;
  constructor(value: string) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!ok) throw new Error('Invalid email format');
    this.value = value;
  }
  toString() { return this.value; }
}

// domain/valueObjects/UserId.ts
export type UserId = string & { readonly brand: unique symbol };
export const toUserId = (v: string) => v as UserId;
```

#### Clock（時刻ポート）

```ts
// domain/time/Clock.ts
export interface Clock {
  now(): Date;
}
export class SystemClock implements Clock {
  now() { return new Date(); }
}
```

#### Entity（VO/ゲッター標準化 & 時刻注入）

```ts
// domain/entities/User.ts
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';
export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private _name: string,
    private readonly _createdAt: Date
  ) {}
  get id() { return this._id; }
  get email() { return this._email; }
  get name() { return this._name; }
  get createdAt() { return this._createdAt; }

  canUpdateProfile(now: Date): boolean {
    const days = (now.getTime() - this._createdAt.getTime()) / 86_400_000;
    return days > 1;
  }
}
```

#### Repository Port

```ts
// domain/repositories/UserRepository.ts
import { User } from '../entities/User';
import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
```

#### AuthService Port（メソッド整合）

```ts
// domain/services/AuthService.ts
export interface AuthService {
  register(userId: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<{ token: string; userId: string }>;
  logout(): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  validateToken(token: string): Promise<boolean>;
}
```

#### ドメインエラー

```ts
// domain/errors/DomainError.ts
export class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message); this.name = 'DomainError';
  }
}

// domain/errors/NotFoundError.ts
export class NotFoundError extends DomainError {
  constructor(resource: string) { super(`${resource} not found`, 'NOT_FOUND'); }
}
```

---

### 2. Infrastructure層

#### Prisma スキーマ & クライアント（Server専用）

```prisma
// infrastructure/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```ts
// infrastructure/prisma/client.ts
import { PrismaClient } from '@prisma/client';
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['query','error','warn'] : ['error'] });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### Prisma リポジトリ（PrismaClientを**注入**）

```ts
// infrastructure/repositories/PrismaUserRepository.ts
import { UserRepository } from '@/domain/repositories/UserRepository';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/valueObjects/Email';
import { UserId, toUserId } from '@/domain/valueObjects/UserId';
import type { PrismaClient } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    if (!row) return null;
    return new User(toUserId(row.id), new Email(row.email), row.name, row.createdAt);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email: email.toString() } });
    if (!row) return null;
    return new User(toUserId(row.id), new Email(row.email), row.name, row.createdAt);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email.toString(), name: user.name },
      create: {
        id: user.id,
        email: user.email.toString(),
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
```

#### Client側でのデータ取得（Server Actions経由）

* Server Actionsを直接呼び出してDTOを取得し、UI層で使用。

```ts
// ui/hooks/useUser.ts
'use client';

import { useState, useEffect } from 'react';
import { UserDto } from '@/application/dto/UserDto';
import { getUser } from '@/app/actions/users';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await getUser(userId);
        setUser(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

#### Server Actions（例）

```ts
// app/actions/users.ts
'use server';

import { createServerContainer } from '@/di/serverContainer';
import { UserDto } from '@/application/dto/UserDto';
import { toUserId } from '@/domain/valueObjects/UserId';

export async function getUser(id: string): Promise<UserDto | null> {
  const { getUserUseCase } = createServerContainer();
  const user = await getUserUseCase.execute(toUserId(id));
  return user;
}
```

---

### 3. Application層

#### UseCase（React/Prisma非依存）

```ts
// application/useCases/GetUserProfileUseCase.ts
import { UserRepository } from '@/domain/repositories/UserRepository';
import { UserId } from '@/domain/valueObjects/UserId';
import { NotFoundError } from '@/domain/errors/NotFoundError';

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(userId: UserId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    return user;
  }
}
```

```ts
// application/useCases/RegisterUserUseCase.ts
import { UserRepository } from '@/domain/repositories/UserRepository';
import { AuthService } from '@/domain/services/AuthService';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';
import { User } from '@/domain/entities/User';

export class RegisterUserUseCase {
  constructor(private userRepo: UserRepository, private auth: AuthService) {}

  async execute(emailStr: string, name: string, password: string) {
    const email = new Email(emailStr);
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('Email already registered');

    const id = toUserId(crypto.randomUUID());
    const user = new User(id, email, name, new Date());
    await this.userRepo.save(user);
    await this.auth.register(user.id, password);
    return user;
  }
}
```

---

### 4. UI層

#### Root Layout（Server Component / コンポジションルートの起点）

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

#### ページ（Server ComponentでUseCase実行）

```tsx
// app/users/[id]/page.tsx
import { createServerContainer } from '@/di/serverContainer';
import { UserProfileView } from '@/ui/components/features/users/UserProfileView';
import { toUserId } from '@/domain/valueObjects/UserId';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const { getUserProfileUseCase } = createServerContainer();
  const user = await getUserProfileUseCase.execute(toUserId(params.id));
  return <UserProfileView user={user} />;
}
```

#### プレゼンテーション

```tsx
// ui/components/features/users/UserProfileView.tsx
import { User } from '@/domain/entities/User';
import { SystemClock } from '@/domain/time/Clock';

export const UserProfileView = ({ user }: { user: User }) => {
  const clock = new SystemClock();
  const canEdit = user.canUpdateProfile(clock.now());
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
      <p className="text-gray-600">{user.email.toString()}</p>
      {canEdit ? (
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">プロフィールを編集</button>
      ) : (
        <p className="mt-4 text-sm text-gray-500">プロフィールの編集は作成から24時間後に可能になります</p>
      )}
    </div>
  );
};
```

#### UI用Hook（Client／HTTP経由）

```ts
// ui/hooks/useUserProfile.ts
'use client';
import { useEffect, useState } from 'react';
import { useAppServices } from '@/di/clientContainer';
import { User } from '@/domain/entities/User';
import { toUserId } from '@/domain/valueObjects/UserId';

export const useUserProfile = (id: string) => {
  const { getUserProfileUseCase } = useAppServices();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    getUserProfileUseCase.execute(toUserId(id))
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading, error };
};
```

---

## 依存性注入の実装（サーバ／クライアント境界）

#### サーバDI（Prisma実装をバインド）

```ts
// di/serverContainer.ts
import { prisma } from '@/infrastructure/prisma/client';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { GetUserProfileUseCase } from '@/application/useCases/GetUserProfileUseCase';
import { RegisterUserUseCase } from '@/application/useCases/RegisterUserUseCase';
import { TokenAuthService } from '@/infrastructure/services/TokenAuthService';

export function createServerContainer() {
  const userRepository = new PrismaUserRepository(prisma);
  const authService = new TokenAuthService(); // 実体はサーバ側
  return {
    getUserProfileUseCase: new GetUserProfileUseCase(userRepository),
    registerUserUseCase: new RegisterUserUseCase(userRepository, authService),
  };
}
```

#### クライアント側のデータ取得

```ts
// クライアント側ではServer Actionsを直接呼び出し
// DIコンテナは不要となり、HooksからServer Actionsを使用
```

> 原則：**Prisma/DBアクセスはサーバのみ**。クライアントはServer Actions経由でデータを取得。

---

## テスト戦略

### 1. ユニットテスト（Domain）

* **時刻依存**は `Clock` をモックする／`canUpdateProfile(now)`に引数で渡す
* VO/Entity/ドメインサービスを純粋に検証

```ts
// __tests__/domain/entities/User.test.ts
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';

describe('User', () => {
  it('can update after 24h', () => {
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const user = new User(toUserId('u1'), new Email('a@b.com'), 'Alice', createdAt);
    const now = new Date('2024-01-02T00:00:01Z');
    expect(user.canUpdateProfile(now)).toBe(true);
  });
});
```

### 2. ユニットテスト（Application）

* リポジトリポートを**モック**し、UseCase単体の振る舞いを検証
* NotFound/重複/認証連携などをエラーコードで検証

```ts
// __tests__/application/useCases/GetUserProfileUseCase.test.ts
import { GetUserProfileUseCase } from '@/application/useCases/GetUserProfileUseCase';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';

describe('GetUserProfileUseCase', () => {
  const repo: jest.Mocked<UserRepository> = {
    findById: jest.fn(), findByEmail: jest.fn(), save: jest.fn(), delete: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('returns user', async () => {
    const user = new User(toUserId('1'), new Email('t@e.com'), 'Test', new Date());
    repo.findById.mockResolvedValue(user);
    const uc = new GetUserProfileUseCase(repo);
    await expect(uc.execute(toUserId('1'))).resolves.toBe(user);
  });

  it('throws NotFound', async () => {
    repo.findById.mockResolvedValue(null);
    const uc = new GetUserProfileUseCase(repo);
    await expect(uc.execute(toUserId('x'))).rejects.toThrow('not found');
  });
});
```

### 3. ユニットテスト（Infrastructure：Prismaリポジトリ）

* **PrismaClientをモック**して呼び出しを検証（DB接続は行わない）

```ts
// __tests__/infrastructure/repositories/PrismaUserRepository.test.ts
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';
import { User } from '@/domain/entities/User';

describe('PrismaUserRepository', () => {
  const prisma = { user: { findUnique: jest.fn(), upsert: jest.fn(), delete: jest.fn() } } as unknown as PrismaClient;
  const repo = new PrismaUserRepository(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('findById', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      id: '1', email: 't@e.com', name: 'T', createdAt: new Date(), updatedAt: new Date(),
    });
    const u = await repo.findById(toUserId('1'));
    expect(u).toBeInstanceOf(User);
  });
});
```

### 4. 統合テスト（Prisma with Test DB）

* `PrismaUserRepository` はコンストラクタで `PrismaClient` を受けるため、**テスト用クライアント**を注入可能
* `TEST_DATABASE_URL` を使い、`beforeAll`/`afterAll` で接続管理、`beforeEach` で `deleteMany()` など

```ts
// __tests__/integration/PrismaUserRepository.integration.test.ts
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';
import { User } from '@/domain/entities/User';

const testPrisma = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL } } });

describe('Integration: PrismaUserRepository', () => {
  let repo: PrismaUserRepository;
  beforeAll(async () => testPrisma.$connect());
  afterAll(async () => testPrisma.$disconnect());
  beforeEach(async () => { await testPrisma.user.deleteMany(); repo = new PrismaUserRepository(testPrisma); });

  it('CRUD', async () => {
    const user = new User(toUserId('u1'), new Email('i@test.com'), 'Integration', new Date());
    await repo.save(user);
    const found = await repo.findById(user.id);
    expect(found?.email.toString()).toBe('i@test.com');
    await repo.delete(user.id);
    expect(await repo.findById(user.id)).toBeNull();
  });
});
```

### 5. UI/Hook テスト

* Hookは**UI層**のため、`clientContainer` をテスト用に差し替え（モックUseCase）

```tsx
// __tests__/ui/hooks/useUserProfile.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { User } from '@/domain/entities/User';
import { toUserId } from '@/domain/valueObjects/UserId';
import { Email } from '@/domain/valueObjects/Email';
import { AppServicesProvider } from './utils/TestAppServicesProvider'; // テスト用DI

describe('useUserProfile', () => {
  it('fetches user', async () => {
    const mockUser = new User(toUserId('1'), new Email('a@b.com'), 'Alice', new Date());
    const services = {
      getUserProfileUseCase: { execute: jest.fn().mockResolvedValue(mockUser) },
    };
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      <AppServicesProvider services={services}>{children}</AppServicesProvider>;

    const { result } = renderHook(() => useUserProfile('1'), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBe(mockUser);
  });
});
```

---

## コーディング規則

### 1. 命名規則

* **ファイル名**

  * Entity/Interface/UseCase/Component: PascalCase
  * UI Hook: camelCase（例: `useUserProfile.ts`）
  * 実装アダプタは技術を接尾辞に（`PrismaUserRepository.ts`, `HttpUserRepository.ts`）
* **クラス/関数/変数**

  * クラス/インターフェース: PascalCase
  * 関数/変数: camelCase
  * 定数: UPPER\_SNAKE\_CASE
* **ゲッター**

  * `get id()` のように**プロパティゲッター**。`getId` のような「get付きメソッド名」禁止

### 2. インポート順序

1. Node/標準 → 2) 外部ライブラリ → 3) domain → 4) application → 5) infrastructure → 6) ui → 7) types → 8) styles

### 3. エラーハンドリング

* ドメイン例外（`DomainError`/`NotFoundError`）で**意味づけ**し、UI側でメッセージ整形
* UseCaseはNotFound/権限/バリデーション等を**例外 or Result型**で表現（プロジェクト方針で統一）

### 4. 型定義のベストプラクティス

* VO/Branded Types で境界の安全性を担保
* Repository戻り値の `null` は**NotFoundのみ**に限定

### 5. Prismaのセットアップと設定

```bash
npm i prisma @prisma/client
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

* `.env`
  `DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"`
* 本番は `npx prisma migrate deploy`

---

## 実装例

### 例1：ユーザー登録（完全フロー）

#### Domain

```ts
// domain/factories/UserFactory.ts
import { User } from '@/domain/entities/User';
import { Email } from '@/domain/valueObjects/Email';
import { toUserId } from '@/domain/valueObjects/UserId';

export class UserFactory {
  static create(email: string, name: string): User {
    const id = toUserId(crypto.randomUUID());
    return new User(id, new Email(email), name, new Date());
  }
}
```

#### Application

```ts
// application/useCases/RegisterUserUseCase.ts （前掲の通り）
```

#### Infrastructure（Server）

```ts
// infrastructure/services/TokenAuthService.ts
import { AuthService } from '@/domain/services/AuthService';
export class TokenAuthService implements AuthService {
  async register(userId: string, password: string) { /* 実装 */ }
  async login(email: string, password: string) { return { token: 't', userId: 'u' }; }
  async logout() { /* ... */ }
  async getCurrentUserId() { return null; }
  async validateToken(_: string) { return true; }
}
```

#### DI（Server）

```ts
// di/serverContainer.ts（前掲）
```

#### Server Action or Route（登録）

```ts
// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { createServerContainer } from '@/di/serverContainer';

export async function POST(req: Request) {
  const { email, name, password } = await req.json();
  const { registerUserUseCase } = createServerContainer();
  try {
    const user = await registerUserUseCase.execute(email, name, password);
    return NextResponse.json({ id: user.id, email: user.email.toString(), name: user.name, createdAt: user.createdAt });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
```

#### UI（フォーム）

```tsx
// ui/components/features/auth/RegisterForm.tsx
'use client';
import { useState } from 'react';

export const RegisterForm = () => {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed');
      // ここでログイン遷移など
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* email/name/password inputs */}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50">
        {loading ? '登録中...' : '登録'}
      </button>
    </form>
  );
};
```

### 例2：プロフィール取得（Server/Client両対応）

* **Serverページ**は `serverContainer` でUseCase実行（DB直）
* **Client Hook** は Server Actions を呼び出してデータ取得

---

## まとめ

* **欠落なく**元の章立て・粒度を維持しつつ、以下を修正反映しました：

  * UseCaseを**アプリ層に固定**（React非依存）、UI Hookは**UI層**へ
  * **Prismaはサーバ専用**、クライアントは**HTTPアダプタ**で同じポートを満たす
  * **DIをサーバ／クライアントで分離**し、Composition Rootを明確化
  * **AuthServiceのインターフェース整合**（`register` 追加）
  * **EntityのVO化／ゲッター標準化**と**時刻依存の注入**
  * **PrismaRepoのPrismaClient注入**で統合テスト容易化
  * テストコードを境界設計に合わせて全面更新

もしこの版をベースに**プロジェクトへ適用するための移行チェックリスト**（PR分割計画、フォルダ移動順、型エラー解消順）も必要なら、このまま作成します。
