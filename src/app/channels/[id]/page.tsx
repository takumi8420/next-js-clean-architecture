'use client';

import { useParams } from 'next/navigation';
import { toChannelId } from '@/domain/valueObjects/ChannelId';
import { toUserId } from '@/domain/valueObjects/UserId';
import { useMessages } from '@/ui/hooks/useMessages';
import { useSendMessage } from '@/ui/hooks/useSendMessage';
import { useChannels } from '@/ui/hooks/useChannels';
import { MessageList } from '@/ui/components/features/messages/MessageList';
import { MessageInput } from '@/ui/components/features/messages/MessageInput';

export default function ChannelPage() {
  const params = useParams();
  const channelId = toChannelId(params.id as string);

  const { channels } = useChannels();
  const { messages, loading, error, refresh } = useMessages(channelId);
  const { sendMessage } = useSendMessage();

  const currentChannel = channels.find((c) => c.id === channelId);
  const currentUserId = toUserId('user-1'); // デモ用に固定ユーザーID

  const handleSendMessage = async (content: string) => {
    const result = await sendMessage(channelId, currentUserId, content);
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

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-gray-600">チャンネルが見つかりません</div>
      </div>
    );
  }

  return (
    <>
      <MessageList messages={messages} channelName={currentChannel.name} />
      <MessageInput onSend={handleSendMessage} channelName={currentChannel.name} />
    </>
  );
}
