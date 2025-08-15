export class Email {
  private readonly value: string;

  constructor(value: string) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      throw new Error('Invalid email format');
    }
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
