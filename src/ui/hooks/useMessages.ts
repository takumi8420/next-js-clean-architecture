'use client';

import { useEffect, useState } from 'react';

import { ChannelId } from '@/domain/valueObjects/ChannelId';
import { getMessagesByChannel } from '@/app/actions/messages';
import { MessageWithUserDto } from '@/application/dto/MessageWithUserDto';

export const useMessages = (channelId: ChannelId) => {
  const [messages, setMessages] = useState<MessageWithUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const result = await getMessagesByChannel(channelId);
        setMessages(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  const refresh = async () => {
    const result = await getMessagesByChannel(channelId);
    setMessages(result);
  };

  return { messages, loading, error, refresh };
};
