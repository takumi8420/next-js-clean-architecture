import { ValidationError } from '../errors/ValidationError';

export type UserId = string & { readonly brand: unique symbol };

export const toUserId = (value: string): UserId => {
  if (!value || value.trim().length === 0) {
    throw new ValidationError('userId', 'cannot be empty');
  }
  return value as UserId;
};
