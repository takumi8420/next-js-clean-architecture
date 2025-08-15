export type ChannelId = string & { readonly brand: unique symbol };

export const toChannelId = (value: string): ChannelId => {
  if (!value || value.trim().length === 0) {
    throw new Error('Invalid channel ID');
  }
  return value as ChannelId;
};
