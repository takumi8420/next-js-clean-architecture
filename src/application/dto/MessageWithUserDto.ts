import { MessageDto } from './MessageDto';
import { UserDto } from './UserDto';

export interface MessageWithUserDto {
  message: MessageDto;
  user: UserDto;
}
