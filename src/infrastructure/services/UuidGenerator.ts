import { IdGenerator } from '@/domain/services/IdGenerator';
import { randomUUID } from 'crypto';

export class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
