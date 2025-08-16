'use server';

import { createServerContainer } from '@/di/serverContainer';
import { ChannelDto } from '@/application/dto/ChannelDto';

export async function getChannels(): Promise<ChannelDto[]> {
  try {
    const { getChannelsUseCase } = createServerContainer();
    return await getChannelsUseCase.execute();
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw new Error('Failed to fetch channels');
  }
}