# 改善提案と実装例

## Critical Issues（最優先対応）

### 1. AuthServiceの実装

#### 現在の状況

```typescript
// src/domain/services/ - 空のディレクトリ
// src/infrastructure/services/ - 空のディレクトリ
```

#### 改善提案

```typescript
// src/domain/services/AuthService.ts
export interface AuthService {
  register(userId: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<{ token: string; userId: string }>;
  logout(): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  validateToken(token: string): Promise<boolean>;
}

// src/infrastructure/services/TokenAuthService.ts
import { AuthService } from '@/domain/services/AuthService';

export class TokenAuthService implements AuthService {
  async register(userId: string, password: string): Promise<void> {
    // JWT実装またはNextAuth.js連携
    // パスワードハッシュ化とユーザー作成
  }

  async login(email: string, password: string): Promise<{ token: string; userId: string }> {
    // 認証ロジック実装
    // JWTトークン生成
    return { token: 'jwt-token', userId: 'user-id' };
  }

  async logout(): Promise<void> {
    // ログアウト処理
  }

  async getCurrentUserId(): Promise<string | null> {
    // 現在のユーザーID取得
    return null;
  }

  async validateToken(token: string): Promise<boolean> {
    // トークン検証
    return true;
  }
}
```

### 2. clientContainerの実装

#### 現在の状況

```typescript
// clientContainer.ts が存在しない
```

#### 改善提案

```typescript
// src/di/clientContainer.ts
'use client';

import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { HttpChannelRepository } from '@/infrastructure/repositories/HttpChannelRepository';
import { HttpMessageRepository } from '@/infrastructure/repositories/HttpMessageRepository';
import { HttpUserRepository } from '@/infrastructure/repositories/HttpUserRepository';
import { SystemClock } from '@/domain/time/Clock';

export function createClientContainer() {
  // HTTPアダプタを使用したリポジトリ実装
  const channelRepository = new HttpChannelRepository();
  const messageRepository = new HttpMessageRepository();
  const userRepository = new HttpUserRepository();
  const clock = new SystemClock();

  return {
    getChannelsUseCase: new GetChannelsUseCase(channelRepository),
    getMessagesByChannelUseCase: new GetMessagesByChannelUseCase(messageRepository, userRepository),
    sendMessageUseCase: new SendMessageUseCase(messageRepository, clock),
  };
}

// src/infrastructure/repositories/HttpChannelRepository.ts
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { Channel } from '@/domain/entities/Channel';
import { ChannelId } from '@/domain/valueObjects/ChannelId';

export class HttpChannelRepository implements IChannelRepository {
  async findById(id: ChannelId): Promise<Channel | null> {
    const response = await fetch(`/api/channels/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return ChannelMapper.toDomain(data);
  }

  async findAll(): Promise<Channel[]> {
    const response = await fetch('/api/channels');
    const data = await response.json();
    return data.map(ChannelMapper.toDomain);
  }

  async findPublicChannels(): Promise<Channel[]> {
    const response = await fetch('/api/channels?public=true');
    const data = await response.json();
    return data.map(ChannelMapper.toDomain);
  }
}
```

## Major Issues（高優先度対応）

### 3. Prismaスキーマの修正

#### 現在の問題

```prisma
model Channel {
  id          String    @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  messages    Message[]
  // isPrivate フィールドが存在しない
}

model Message {
  id        String   @id @default(uuid())
  content   String
  userId    String
  channelId String
  timestamp DateTime @default(now())
  // updatedAt フィールドが存在しない
  user      User     @relation(fields: [userId], references: [id])
  channel   Channel  @relation(fields: [channelId], references: [id])

  @@index([channelId, timestamp])
}
```

#### 改善提案

```prisma
model Channel {
  id          String    @id @default(uuid())
  name        String
  description String?
  isPrivate   Boolean   @default(false)  // 追加
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  messages    Message[]
}

model Message {
  id        String    @id @default(uuid())
  content   String
  userId    String
  channelId String
  timestamp DateTime  @default(now())
  updatedAt DateTime? // 追加（編集時刻）
  user      User      @relation(fields: [userId], references: [id])
  channel   Channel   @relation(fields: [channelId], references: [id])

  @@index([channelId, timestamp])
}
```

### 4. エンティティでのドメインエラー使用

#### 現在の問題

```typescript
// src/domain/entities/User.ts
updateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Name cannot be empty'); // 汎用Errorを使用
  }
  this._name = name;
}
```

#### 改善提案

```typescript
// src/domain/entities/User.ts
import { ValidationError } from '../errors/ValidationError';

updateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('name', 'Name cannot be empty'); // ドメインエラーを使用
  }
  this._name = name;
}

// src/domain/entities/Channel.ts
import { ValidationError } from '../errors/ValidationError';

updateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('name', 'Channel name cannot be empty');
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    throw new ValidationError('name', 'Channel name can only contain letters, numbers, hyphens, and underscores');
  }
  this._name = name;
}
```

### 5. UserRepositoryのsaveメソッド実装

#### 現在の問題

```typescript
// src/domain/repositories/UserRepository.ts
export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  // saveメソッドが存在しない
}
```

#### 改善提案

```typescript
// src/domain/repositories/UserRepository.ts
export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>; // 追加
  delete(id: UserId): Promise<void>; // 追加
}

// src/infrastructure/repositories/PrismaUserRepository.ts
async save(user: User): Promise<void> {
  await this.prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email.toString(),
      name: user.name,
      status: user.status,
    },
    create: {
      id: user.id,
      email: user.email.toString(),
      name: user.name,
      status: user.status,
    },
  });
}

async delete(id: UserId): Promise<void> {
  await this.prisma.user.delete({ where: { id } });
}
```

## Minor Issues（中優先度対応）

### 6. バリューオブジェクト実装パターンの統一

#### 改善提案（Option A: 全てクラスベース）

```typescript
// src/domain/valueObjects/UserId.ts
export class UserId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('userId', 'Invalid user ID');
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
```

#### 改善提案（Option B: 全てBranded Type）

```typescript
// src/domain/valueObjects/Email.ts
export type Email = string & { readonly brand: unique symbol };

export const toEmail = (value: string): Email => {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!isValid) {
    throw new ValidationError('email', 'Invalid email format');
  }
  return value as Email;
};
```

### 7. 時刻依存の完全な抽象化

#### 現在の問題

```typescript
// src/application/useCases/SendMessageUseCase.ts
const messageId = toMessageId(`msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
```

#### 改善提案

```typescript
// src/domain/services/IdGenerator.ts
export interface IdGenerator {
  generateMessageId(): MessageId;
  generateUserId(): UserId;
  generateChannelId(): ChannelId;
}

// src/infrastructure/services/UuidIdGenerator.ts
import { IdGenerator } from '@/domain/services/IdGenerator';
import { v4 as uuidv4 } from 'uuid';

export class UuidIdGenerator implements IdGenerator {
  generateMessageId(): MessageId {
    return toMessageId(`msg-${uuidv4()}`);
  }

  generateUserId(): UserId {
    return toUserId(`user-${uuidv4()}`);
  }

  generateChannelId(): ChannelId {
    return toChannelId(`channel-${uuidv4()}`);
  }
}

// src/application/useCases/SendMessageUseCase.ts
export class SendMessageUseCase {
  constructor(
    private readonly messageRepository: IMessageRepository,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator, // 追加
  ) {}

  async execute(input: SendMessageInputDto): Promise<MessageDto> {
    if (!input.content || input.content.trim().length === 0) {
      throw new ValidationError('content', 'Message content cannot be empty');
    }

    const messageId = this.idGenerator.generateMessageId(); // 修正
    const now = this.clock.now();

    // 以下同じ
  }
}
```

## 実装優先度とロードマップ

### Phase 1（即座に対応）

1. AuthServiceポートと実装の追加
2. Prismaスキーマの修正とマイグレーション
3. エンティティでのドメインエラー使用

### Phase 2（1-2週間以内）

4. clientContainerとHTTPアダプタの実装
5. UserRepositoryのsaveメソッド実装
6. 統合テストの追加

### Phase 3（1ヶ月以内）

7. バリューオブジェクト実装パターンの統一
8. 時刻・ID生成の完全な抽象化
9. インポート順序の統一（ESLintルール）

### Phase 4（長期的改善）

10. E2Eテストフレームワークの導入
11. パフォーマンス最適化
12. セキュリティ強化
