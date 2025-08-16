'use client';

import { useState } from 'react';

import { sendMessage as sendMessageAction } from '@/app/actions/messages';
import { MessageDto } from '@/application/dto/MessageDto';

export const useSendMessage = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (
    channelId: string,
    userId: string,
    content: string,
  ): Promise<MessageDto | null> => {
    try {
      setSending(true);
      setError(null);
      const message = await sendMessageAction({
        channelId,
        userId,
        content,
      });
      return message;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      return null;
    } finally {
      setSending(false);
    }
  };

  return { sendMessage, sending, error };
};
