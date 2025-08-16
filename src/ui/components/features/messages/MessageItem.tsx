import React from 'react';
import { MessageDto } from '@/application/dto/MessageDto';
import { UserDto } from '@/application/dto/UserDto';
import { Avatar } from '@/ui/components/common/Avatar';

interface MessageItemProps {
  message: MessageDto;
  user: UserDto;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, user }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex gap-3 px-6 py-2 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        <Avatar name={user.name} size="md" status={user.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-gray-900">{user.name}</span>
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
        </div>
        <p className="text-gray-800 whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
};
