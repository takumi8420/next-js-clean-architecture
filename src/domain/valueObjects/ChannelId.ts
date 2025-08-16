import { ValidationError } from '../errors/ValidationError';

export type ChannelId = string & { readonly brand: unique symbol };

export const toChannelId = (value: string): ChannelId => {
  if (!value || value.trim().length === 0) {
    throw new ValidationError('channelId', 'cannot be empty');
  }
  return value as ChannelId;
};
