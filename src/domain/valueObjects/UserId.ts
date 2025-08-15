export type UserId = string & { readonly brand: unique symbol };

export const toUserId = (value: string): UserId => {
  if (!value || value.trim().length === 0) {
    throw new Error('Invalid user ID');
  }
  return value as UserId;
};
