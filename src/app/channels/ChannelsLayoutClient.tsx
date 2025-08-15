'use client';

import { Sidebar } from '@/ui/components/features/channels/Sidebar';
import { useChannels } from '@/ui/hooks/useChannels';

export function ChannelsLayoutClient({ children }: { children: React.ReactNode }) {
  const { channels, loading, error } = useChannels();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">エラーが発生しました: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar channels={channels} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
