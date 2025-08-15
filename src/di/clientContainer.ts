'use client';

import { MockUserRepository } from '@/infrastructure/repositories/MockUserRepository';
import { MockChannelRepository } from '@/infrastructure/repositories/MockChannelRepository';
import { MockMessageRepository } from '@/infrastructure/repositories/MockMessageRepository';
import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { SystemClock } from '@/domain/time/Clock';

let services: {
  getChannelsUseCase: GetChannelsUseCase;
  getMessagesByChannelUseCase: GetMessagesByChannelUseCase;
  sendMessageUseCase: SendMessageUseCase;
} | null = null;

const initializeServices = () => {
  if (!services) {
    const userRepository = new MockUserRepository();
    const channelRepository = new MockChannelRepository();
    const messageRepository = new MockMessageRepository();
    const clock = new SystemClock();

    services = {
      getChannelsUseCase: new GetChannelsUseCase(channelRepository),
      getMessagesByChannelUseCase: new GetMessagesByChannelUseCase(
        messageRepository,
        userRepository,
      ),
      sendMessageUseCase: new SendMessageUseCase(messageRepository, clock),
    };
  }
  return services;
};

export const useAppServices = () => {
  return initializeServices();
};
