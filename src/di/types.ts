export const TYPES = {
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ChannelRepository: Symbol.for('ChannelRepository'),
  MessageRepository: Symbol.for('MessageRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  IdGenerator: Symbol.for('IdGenerator'),
  Clock: Symbol.for('Clock'),

  // Use Cases
  GetChannelsUseCase: Symbol.for('GetChannelsUseCase'),
  GetMessagesByChannelUseCase: Symbol.for('GetMessagesByChannelUseCase'),
  SendMessageUseCase: Symbol.for('SendMessageUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  ValidateTokenUseCase: Symbol.for('ValidateTokenUseCase'),
};
