import { ValueObject } from './ValueObject';
import { ValidationError } from '../errors/ValidationError';

export type UserStatusType = 'online' | 'away' | 'offline';

export class UserStatus extends ValueObject<UserStatusType> {
  private static readonly VALID_STATUSES: UserStatusType[] = ['online', 'away', 'offline'];

  constructor(value: UserStatusType) {
    super(value);
  }

  protected validate(value: UserStatusType): void {
    if (!UserStatus.VALID_STATUSES.includes(value)) {
      throw new ValidationError(
        'status',
        `must be one of: ${UserStatus.VALID_STATUSES.join(', ')}`,
      );
    }
  }

  static create(value: UserStatusType): UserStatus {
    return new UserStatus(value);
  }

  static online(): UserStatus {
    return new UserStatus('online');
  }

  static away(): UserStatus {
    return new UserStatus('away');
  }

  static offline(): UserStatus {
    return new UserStatus('offline');
  }

  isOnline(): boolean {
    return this._value === 'online';
  }

  isAway(): boolean {
    return this._value === 'away';
  }

  isOffline(): boolean {
    return this._value === 'offline';
  }
}
