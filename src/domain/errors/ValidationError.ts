import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(field: string, message: string) {
    super(`${field}: ${message}`, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}