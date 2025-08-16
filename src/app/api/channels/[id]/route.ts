import { NextRequest, NextResponse } from 'next/server';
import { createServerContainer } from '@/di/serverContainer';
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { TYPES } from '@/di/types';
import { ChannelMapper } from '@/application/mappers/ChannelMapper';
import { toChannelId } from '@/domain/valueObjects/ChannelId';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const container = createServerContainer();
    const channelRepository = container.get<IChannelRepository>(TYPES.ChannelRepository);

    const channel = await channelRepository.findById(toChannelId(id));

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    return NextResponse.json(ChannelMapper.toDto(channel));
  } catch (error) {
    console.error('Error fetching channel:', error);
    return NextResponse.json({ error: 'Failed to fetch channel' }, { status: 500 });
  }
}
