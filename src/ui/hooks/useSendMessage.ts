'use client';

import { useState } from 'react';
import { useAppServices } from '@/di/clientContainer';
import { ChannelId } from '@/domain/valueObjects/ChannelId';
import { UserId } from '@/domain/valueObjects/UserId';
import { Message } from '@/domain/entities/Message';

export const useSendMessage = () => {
  const { sendMessageUseCase } = useAppServices();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (
    channelId: ChannelId,
    userId: UserId,
    content: string,
  ): Promise<Message | null> => {
    try {
      setSending(true);
      setError(null);
      const message = await sendMessageUseCase.execute({
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
