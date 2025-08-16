'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChannelDto } from '@/application/dto/ChannelDto';

interface SidebarProps {
  channels: ChannelDto[];
}

export const Sidebar: React.FC<SidebarProps> = ({ channels }) => {
  const pathname = usePathname();
  const currentChannelId = pathname.split('/').pop();

  return (
    <div className="w-64 bg-gray-800 text-gray-100 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Slack Clone</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">Channels</h2>
          <ul>
            {channels.map((channel) => (
              <li key={channel.id}>
                <Link
                  href={`/channels/${channel.id}`}
                  className={`
                    flex items-center px-2 py-1 rounded hover:bg-gray-700 transition-colors
                    ${currentChannelId === channel.id ? 'bg-gray-700' : ''}
                  `}
                >
                  <span className="text-gray-400 mr-2">#</span>
                  <span className="truncate">{channel.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
