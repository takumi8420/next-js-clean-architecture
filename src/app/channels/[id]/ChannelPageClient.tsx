'use client';

import { useParams } from 'next/navigation';

import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { ChannelDto } from '@/application/dto/ChannelDto';
import { MessageList } from '@/ui/components/features/messages/MessageList';
import { MessageInput } from '@/ui/components/features/messages/MessageInput';
import { useMessages } from '@/ui/hooks/useMessages';
import { useSendMessage } from '@/ui/hooks/useSendMessage';

interface ChannelPageClientProps {
  channel: ChannelDto;
}

export default function ChannelPageClient({ channel }: ChannelPageClientProps) {
  const params = useParams();
  const channelIdStr = params.id as string;
  const channelId = toChannelId(channelIdStr);

  const { messages, loading, error, refresh } = useMessages(channelId);
  const { sendMessage } = useSendMessage();

  const currentUserId = 'user-1'; // デモ用に固定ユーザーID

  const handleSendMessage = async (content: string) => {
    const result = await sendMessage(channelIdStr, currentUserId, content);
    if (result) {
      await refresh();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-gray-600">メッセージを読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-red-600">エラーが発生しました: {error.message}</div>
      </div>
    );
  }

  return (
    <>
      <MessageList messages={messages} channelName={channel.name} />
      <MessageInput onSend={handleSendMessage} channelName={channel.name} />
    </>
  );
}
