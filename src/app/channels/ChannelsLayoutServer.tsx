import { createServerContainer } from '@/di/serverContainer';
import { ChannelsLayoutClient } from './ChannelsLayoutClient';
import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { TYPES } from '@/di/types';

export default async function ChannelsLayoutServer({ children }: { children: React.ReactNode }) {
  const container = createServerContainer();
  const getChannelsUseCase = container.get<GetChannelsUseCase>(TYPES.GetChannelsUseCase);

  try {
    const channels = await getChannelsUseCase.execute();
    return <ChannelsLayoutClient channels={channels}>{children}</ChannelsLayoutClient>;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
}
