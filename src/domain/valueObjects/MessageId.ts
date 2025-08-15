export type MessageId = string & { readonly brand: unique symbol };

export const toMessageId = (value: string): MessageId => {
  if (!value || value.trim().length === 0) {
    throw new Error('Invalid message ID');
  }
  return value as MessageId;
};
