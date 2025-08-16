import { ValidationError } from '../errors/ValidationError';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      throw new ValidationError('email', 'invalid format');
    }
    this._value = value;
  }

  toString(): string {
    return this._value;
  }

  get value(): string {
    return this._value;
  }
}
