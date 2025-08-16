'use server';

import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { ValidationError } from '@/domain/errors/ValidationError';
import { DomainError } from '@/domain/errors/DomainError';
import { MessageWithUserDto } from '@/application/dto/MessageWithUserDto';
import { MessageDto } from '@/application/dto/MessageDto';
import { SendMessageInputDto } from '@/application/dto/SendMessageInputDto';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { createServerContainer } from '@/di/serverContainer';
import { TYPES } from '@/di/types';

export async function getMessagesByChannel(channelId: string): Promise<MessageWithUserDto[]> {
  try {
    const container = createServerContainer();
    const getMessagesByChannelUseCase = container.get<GetMessagesByChannelUseCase>(
      TYPES.GetMessagesByChannelUseCase,
    );
    return await getMessagesByChannelUseCase.execute(toChannelId(channelId));
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Error(`Not found: ${error.message}`);
    }
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

export async function sendMessage(input: SendMessageInputDto): Promise<MessageDto> {
  try {
    if (!input.userId) {
      throw new ValidationError('userId', 'User ID is required');
    }

    const container = createServerContainer();
    const sendMessageUseCase = container.get<SendMessageUseCase>(TYPES.SendMessageUseCase);
    return await sendMessageUseCase.execute(input);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    if (error instanceof DomainError) {
      throw new Error(`Domain error: ${error.message}`);
    }
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}
