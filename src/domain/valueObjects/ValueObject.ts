export abstract class ValueObject<T> {
  protected readonly _value: T;

  protected constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  protected abstract validate(value: T): void;

  equals(other: ValueObject<T>): boolean {
    if (!other || !(other instanceof this.constructor)) {
      return false;
    }
    return this._value === other._value;
  }

  get value(): T {
    return this._value;
  }

  toString(): string {
    return String(this._value);
  }
}
