'use client';

import { useEffect, useState } from 'react';
import { useAppServices } from '@/di/clientContainer';
import { MessageWithUser } from '@/application/useCases/GetMessagesByChannelUseCase';
import { ChannelId } from '@/domain/valueObjects/ChannelId';

export const useMessages = (channelId: ChannelId) => {
  const { getMessagesByChannelUseCase } = useAppServices();
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const result = await getMessagesByChannelUseCase.execute(channelId);
        setMessages(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId, getMessagesByChannelUseCase]);

  const refresh = async () => {
    const result = await getMessagesByChannelUseCase.execute(channelId);
    setMessages(result);
  };

  return { messages, loading, error, refresh };
};
