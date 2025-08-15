'use client';

import { useEffect, useState } from 'react';
import { useAppServices } from '@/di/clientContainer';
import { Channel } from '@/domain/entities/Channel';

export const useChannels = () => {
  const { getChannelsUseCase } = useAppServices();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const result = await getChannelsUseCase.execute();
        setChannels(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch channels'));
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [getChannelsUseCase]);

  return { channels, loading, error };
};
