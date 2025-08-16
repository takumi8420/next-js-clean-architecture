import { UserId } from '../valueObjects/UserId';
import { Email } from '../valueObjects/Email';
import { ValidationError } from '../errors/ValidationError';

export type UserStatus = 'online' | 'away' | 'offline';

export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private _name: string,
    private _status: UserStatus,
    private readonly _createdAt: Date,
  ) {}

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get status(): UserStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('name', 'cannot be empty');
    }
    this._name = name;
  }

  updateStatus(status: UserStatus): void {
    this._status = status;
  }
}
