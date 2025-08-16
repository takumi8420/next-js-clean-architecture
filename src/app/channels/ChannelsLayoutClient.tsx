'use client';

import { Sidebar } from '@/ui/components/features/channels/Sidebar';
import { ChannelDto } from '@/application/dto/ChannelDto';

interface ChannelsLayoutClientProps {
  channels: ChannelDto[];
  children: React.ReactNode;
}

export function ChannelsLayoutClient({ channels, children }: ChannelsLayoutClientProps) {
  return (
    <div className="flex h-screen">
      <Sidebar channels={channels} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
