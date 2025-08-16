'use server';

import { ChannelDto } from '@/application/dto/ChannelDto';
import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { createServerContainer } from '@/di/serverContainer';
import { TYPES } from '@/di/types';

export async function getChannels(): Promise<ChannelDto[]> {
  try {
    const container = createServerContainer();
    const getChannelsUseCase = container.get<GetChannelsUseCase>(TYPES.GetChannelsUseCase);
    return await getChannelsUseCase.execute();
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw new Error('Failed to fetch channels');
  }
}
