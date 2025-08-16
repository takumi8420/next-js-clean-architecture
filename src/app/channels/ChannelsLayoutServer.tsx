import { createServerContainer } from '@/di/serverContainer';
import { ChannelsLayoutClient } from './ChannelsLayoutClient';

export default async function ChannelsLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getChannelsUseCase } = createServerContainer();
  
  try {
    const channels = await getChannelsUseCase.execute();
    return <ChannelsLayoutClient channels={channels}>{children}</ChannelsLayoutClient>;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
}