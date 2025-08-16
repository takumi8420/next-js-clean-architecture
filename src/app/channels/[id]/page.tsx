import { notFound } from 'next/navigation';
import { createServerContainer } from '@/di/serverContainer';
import ChannelPageClient from './ChannelPageClient';
import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { TYPES } from '@/di/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChannelPage({ params }: PageProps) {
  const container = createServerContainer();
  const getChannelsUseCase = container.get<GetChannelsUseCase>(TYPES.GetChannelsUseCase);
  const { id } = await params;

  try {
    const channels = await getChannelsUseCase.execute();
    const channel = channels.find((c) => c.id === id);

    if (!channel) {
      notFound();
    }

    return <ChannelPageClient channel={channel} />;
  } catch (error) {
    console.error('Error fetching channel:', error);
    throw error;
  }
}
