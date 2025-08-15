export const mockUsers = [
  {
    id: 'user-1',
    name: '田中太郎',
    email: 'tanaka@example.com',
    status: 'online' as const,
  },
  {
    id: 'user-2',
    name: '佐藤花子',
    email: 'sato@example.com',
    status: 'online' as const,
  },
  {
    id: 'user-3',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    status: 'away' as const,
  },
];

export const mockChannels = [
  {
    id: 'channel-1',
    name: 'general',
    description: '全体連絡用チャンネル',
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'channel-2',
    name: 'random',
    description: '雑談チャンネル',
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'channel-3',
    name: 'dev-team',
    description: '開発チーム専用',
    isPrivate: true,
    createdAt: '2024-01-02T00:00:00.000Z',
  },
];

export const mockMessages = [
  {
    id: 'msg-1',
    channelId: 'channel-1',
    userId: 'user-1',
    content: 'こんにちは！新しいプロジェクトについて話しましょう。',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'msg-2',
    channelId: 'channel-1',
    userId: 'user-2',
    content: 'いいですね！いつミーティングしましょうか？',
    createdAt: '2024-01-15T09:05:00.000Z',
  },
  {
    id: 'msg-3',
    channelId: 'channel-1',
    userId: 'user-1',
    content: '今日の午後3時はどうですか？',
    createdAt: '2024-01-15T09:10:00.000Z',
  },
  {
    id: 'msg-4',
    channelId: 'channel-2',
    userId: 'user-3',
    content: '今日のランチはどこに行きますか？',
    createdAt: '2024-01-15T11:30:00.000Z',
  },
  {
    id: 'msg-5',
    channelId: 'channel-2',
    userId: 'user-1',
    content: 'イタリアンはどうですか？',
    createdAt: '2024-01-15T11:35:00.000Z',
  },
  {
    id: 'msg-6',
    channelId: 'channel-3',
    userId: 'user-2',
    content: 'バグ修正のPRをレビューお願いします！',
    createdAt: '2024-01-15T14:00:00.000Z',
  },
  {
    id: 'msg-7',
    channelId: 'channel-3',
    userId: 'user-1',
    content: '確認します！',
    createdAt: '2024-01-15T14:05:00.000Z',
  },
];
