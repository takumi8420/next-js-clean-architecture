import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { prisma } from '@/infrastructure/prisma/client';
import { PrismaChannelRepository } from '@/infrastructure/repositories/PrismaChannelRepository';
import { PrismaMessageRepository } from '@/infrastructure/repositories/PrismaMessageRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { MockChannelRepository } from '@/infrastructure/repositories/MockChannelRepository';
import { MockMessageRepository } from '@/infrastructure/repositories/MockMessageRepository';
import { MockUserRepository } from '@/infrastructure/repositories/MockUserRepository';
import { SystemClock } from '@/domain/time/Clock';

export function createServerContainer() {
  const usePrisma = process.env.USE_PRISMA === 'true';
  
  // Prisma実装またはMock実装を環境変数で切り替え
  const channelRepository = usePrisma
    ? new PrismaChannelRepository(prisma)
    : new MockChannelRepository();
  const messageRepository = usePrisma
    ? new PrismaMessageRepository(prisma)
    : new MockMessageRepository();
  const userRepository = usePrisma
    ? new PrismaUserRepository(prisma)
    : new MockUserRepository();
  
  const clock = new SystemClock();

  return {
    getChannelsUseCase: new GetChannelsUseCase(channelRepository),
    getMessagesByChannelUseCase: new GetMessagesByChannelUseCase(messageRepository, userRepository),
    sendMessageUseCase: new SendMessageUseCase(messageRepository, clock),
  };
}