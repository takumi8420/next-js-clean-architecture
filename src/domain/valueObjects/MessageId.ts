import { ValidationError } from '../errors/ValidationError';

export type MessageId = string & { readonly brand: unique symbol };

export const toMessageId = (value: string): MessageId => {
  if (!value || value.trim().length === 0) {
    throw new ValidationError('messageId', 'cannot be empty');
  }
  return value as MessageId;
};
