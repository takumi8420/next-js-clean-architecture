export interface UserDto {
  id: string;
  email: string;
  name: string;
  status: 'online' | 'away' | 'offline';
}