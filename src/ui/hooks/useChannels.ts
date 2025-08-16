'use client';

import { useEffect, useState } from 'react';

import { getChannels } from '@/app/actions/channels';
import { ChannelDto } from '@/application/dto/ChannelDto';

export const useChannels = () => {
  const [channels, setChannels] = useState<ChannelDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const result = await getChannels();
        setChannels(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch channels'));
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  return { channels, loading, error };
};
