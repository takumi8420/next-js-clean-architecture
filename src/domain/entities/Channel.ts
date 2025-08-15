import { ChannelId } from '../valueObjects/ChannelId';

export class Channel {
  constructor(
    private readonly _id: ChannelId,
    private _name: string,
    private _description: string,
    private readonly _isPrivate: boolean,
    private readonly _createdAt: Date,
  ) {}

  get id(): ChannelId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get isPrivate(): boolean {
    return this._isPrivate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Channel name cannot be empty');
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      throw new Error('Channel name can only contain letters, numbers, hyphens, and underscores');
    }
    this._name = name;
  }

  updateDescription(description: string): void {
    this._description = description;
  }
}
