import { Container } from 'inversify';
import { TYPES } from '@/di/types';
import { IChannelRepository } from '@/domain/repositories/ChannelRepository';
import { IMessageRepository } from '@/domain/repositories/MessageRepository';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { HttpChannelRepository } from '@/infrastructure/repositories/HttpChannelRepository';
import { HttpMessageRepository } from '@/infrastructure/repositories/HttpMessageRepository';
import { HttpUserRepository } from '@/infrastructure/repositories/HttpUserRepository';
import { GetChannelsUseCase } from '@/application/useCases/GetChannelsUseCase';
import { GetMessagesByChannelUseCase } from '@/application/useCases/GetMessagesByChannelUseCase';
import { SendMessageUseCase } from '@/application/useCases/SendMessageUseCase';
import { Clock, SystemClock } from '@/domain/time/Clock';
import { IdGenerator } from '@/domain/services/IdGenerator';
import { BrowserUuidGenerator } from '@/infrastructure/services/BrowserUuidGenerator';

export function createClientContainer() {
  const container = new Container();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  // Repositories - HTTP実装
  container
    .bind<IChannelRepository>(TYPES.ChannelRepository)
    .toConstantValue(new HttpChannelRepository(apiBaseUrl));
  container
    .bind<IMessageRepository>(TYPES.MessageRepository)
    .toConstantValue(new HttpMessageRepository(apiBaseUrl));
  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(new HttpUserRepository(apiBaseUrl));

  // Services
  container.bind<IdGenerator>(TYPES.IdGenerator).to(BrowserUuidGenerator);
  container.bind<Clock>(TYPES.Clock).to(SystemClock);

  // Use Cases
  container.bind<GetChannelsUseCase>(TYPES.GetChannelsUseCase).to(GetChannelsUseCase);
  container
    .bind<GetMessagesByChannelUseCase>(TYPES.GetMessagesByChannelUseCase)
    .to(GetMessagesByChannelUseCase);
  container.bind<SendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase);

  return container;
}
