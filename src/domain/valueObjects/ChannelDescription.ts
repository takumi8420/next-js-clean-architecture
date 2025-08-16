import { ValueObject } from './ValueObject';

export class ChannelDescription extends ValueObject<string> {
  constructor(value: string) {
    super(value.trim());
  }

  protected validate(_value: string): void {
    // 説明は空でも良いので、特別なバリデーションは不要
    // _value パラメータは基底クラスの要件のため必要
  }

  static create(value: string): ChannelDescription {
    return new ChannelDescription(value);
  }

  static empty(): ChannelDescription {
    return new ChannelDescription('');
  }
}
