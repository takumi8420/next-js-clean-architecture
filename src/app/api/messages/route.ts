import { NextRequest, NextResponse } from 'next/server';
import { createServerContainer } from '@/di/serverContainer';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { TYPES } from '@/di/types';
import { getCurrentUser } from '@/app/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { channelId, content } = body;

    if (!channelId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const container = createServerContainer();
    const sendMessageUseCase = container.get<SendMessageUseCase>(TYPES.SendMessageUseCase);

    const message = await sendMessageUseCase.execute({
      channelId,
      userId: user.id,
      content,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
