import { MessageId } from '../valueObjects/MessageId';
import { ChannelId } from '../valueObjects/ChannelId';
import { UserId } from '../valueObjects/UserId';
import { ValidationError } from '../errors/ValidationError';

export class Message {
  constructor(
    private readonly _id: MessageId,
    private readonly _channelId: ChannelId,
    private readonly _userId: UserId,
    private _content: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date | null = null,
  ) {}

  get id(): MessageId {
    return this._id;
  }

  get channelId(): ChannelId {
    return this._channelId;
  }

  get userId(): UserId {
    return this._userId;
  }

  get content(): string {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get isEdited(): boolean {
    return this._updatedAt !== null;
  }

  updateContent(content: string, now: Date): void {
    if (!content || content.trim().length === 0) {
      throw new ValidationError('content', 'cannot be empty');
    }
    this._content = content.trim();
    this._updatedAt = now;
  }

  canEdit(userId: UserId, now: Date): boolean {
    if (this._userId !== userId) {
      return false;
    }
    const fiveMinutes = 5 * 60 * 1000;
    return now.getTime() - this._createdAt.getTime() < fiveMinutes;
  }
}
