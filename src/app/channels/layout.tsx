import { ChannelsLayoutClient } from './ChannelsLayoutClient';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
  return <ChannelsLayoutClient>{children}</ChannelsLayoutClient>;
}
