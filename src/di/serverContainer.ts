import { Container } from 'inversify';

import { Clock, SystemClock } from '@/domain/time/Clock';
import { IdGenerator } from '@/domain/services/IdGenerator';
import { AuthService } from '@/domain/services/AuthService';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { LoginUseCase } from '@/application/useCases/LoginUseCase';
import { ValidateTokenUseCase } from '@/application/useCases/ValidateTokenUseCase';
import { prisma } from '@/infrastructure/prisma/client';
import { PrismaChannelRepository } from '@/infrastructure/repositories/PrismaChannelRepository';
import { PrismaMessageRepository } from '@/infrastructure/repositories/PrismaMessageRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { MockChannelRepository } from '@/infrastructure/repositories/MockChannelRepository';
import { MockMessageRepository } from '@/infrastructure/repositories/MockMessageRepository';
import { MockUserRepository } from '@/infrastructure/repositories/MockUserRepository';
import { TokenAuthService } from '@/infrastructure/services/TokenAuthService';
import { UuidGenerator } from '@/infrastructure/services/UuidGenerator';
import { TYPES } from '@/di/types';

export function createServerContainer() {
  const container = new Container();
  const usePrisma = process.env.USE_PRISMA === 'true';

  // Repositories
  if (usePrisma) {
    container
      .bind<IChannelRepository>(TYPES.ChannelRepository)
      .toConstantValue(new PrismaChannelRepository(prisma));
    container
      .bind<IMessageRepository>(TYPES.MessageRepository)
      .toConstantValue(new PrismaMessageRepository(prisma));
    container
      .bind<IUserRepository>(TYPES.UserRepository)
      .toConstantValue(new PrismaUserRepository(prisma));
  } else {
    container.bind<IChannelRepository>(TYPES.ChannelRepository).to(MockChannelRepository);
    container.bind<IMessageRepository>(TYPES.MessageRepository).to(MockMessageRepository);
    container.bind<IUserRepository>(TYPES.UserRepository).to(MockUserRepository);
  }

  // Services
  container.bind<AuthService>(TYPES.AuthService).to(TokenAuthService);
  container.bind<IdGenerator>(TYPES.IdGenerator).to(UuidGenerator);
  container.bind<Clock>(TYPES.Clock).to(SystemClock);

  // Use Cases
  container.bind<GetChannelsUseCase>(TYPES.GetChannelsUseCase).to(GetChannelsUseCase);
  container
    .bind<GetMessagesByChannelUseCase>(TYPES.GetMessagesByChannelUseCase)
    .to(GetMessagesByChannelUseCase);
  container.bind<SendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase);
  container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
  container.bind<ValidateTokenUseCase>(TYPES.ValidateTokenUseCase).to(ValidateTokenUseCase);

  return container;
}
