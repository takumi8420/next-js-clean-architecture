import { NextRequest, NextResponse } from 'next/server';

import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { createServerContainer } from '@/di/serverContainer';
import { TYPES } from '@/di/types';

export async function GET(request: NextRequest) {
  try {
    const container = createServerContainer();
    const getChannelsUseCase = container.get<GetChannelsUseCase>(TYPES.GetChannelsUseCase);

    const searchParams = request.nextUrl.searchParams;
    const publicOnly = searchParams.get('public') === 'true';

    const channels = await getChannelsUseCase.execute();

    // publicOnlyの場合はフィルタリング
    const filteredChannels = publicOnly
      ? channels.filter((channel) => !channel.isPrivate)
      : channels;

    return NextResponse.json(filteredChannels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 });
  }
}
