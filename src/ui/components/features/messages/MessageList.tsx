import React, { useEffect, useRef } from 'react';
import { MessageWithUser } from '@/application/useCases/GetMessagesByChannelUseCase';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: MessageWithUser[];
  channelName: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, channelName }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">#{channelName}</h2>
      </div>

      <div className="py-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">まだメッセージがありません</div>
        ) : (
          messages.map(({ message, user }) => (
            <MessageItem key={message.id} message={message} user={user} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
