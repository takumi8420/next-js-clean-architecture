import ChannelsLayoutServer from './ChannelsLayoutServer';

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
  return <ChannelsLayoutServer>{children}</ChannelsLayoutServer>;
}
