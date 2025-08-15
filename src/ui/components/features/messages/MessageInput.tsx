'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/components/common/Button';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  channelName: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, channelName }) => {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await onSend(content);
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`#${channelName} にメッセージを送信`}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                     placeholder-gray-400"
          rows={1}
          disabled={sending}
        />
        <Button type="submit" disabled={!content.trim() || sending}>
          送信
        </Button>
      </div>
    </form>
  );
};
