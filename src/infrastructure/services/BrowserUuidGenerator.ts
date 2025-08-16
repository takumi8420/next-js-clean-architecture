import { IdGenerator } from '@/domain/services/IdGenerator';

export class BrowserUuidGenerator implements IdGenerator {
  generate(): string {
    // ブラウザ環境でのUUID生成
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
