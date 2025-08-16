import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export class ChannelId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('channelId', 'cannot be empty');
    }
  }

  static create(value: string): ChannelId {
    return new ChannelId(value);
  }
}
