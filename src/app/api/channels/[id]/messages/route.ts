import { NextRequest, NextResponse } from 'next/server';
import { createServerContainer } from '@/di/serverContainer';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { TYPES } from '@/di/types';
import { ChannelId } from '@/domain/valueObjects/ChannelId';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const container = createServerContainer();
    const getMessagesByChannelUseCase = container.get<GetMessagesByChannelUseCase>(
      TYPES.GetMessagesByChannelUseCase,
    );

    const messages = await getMessagesByChannelUseCase.execute(id as ChannelId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
