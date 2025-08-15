import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'away' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', status }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400',
  };

  // 名前から背景色を生成
  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-gray-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // 名前からイニシャルを取得
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${
          sizeClasses[size]
        } ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-semibold`}
      >
        {getInitials(name)}
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 ${
            size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
          } ${statusColors[status]} rounded-full border-2 border-white`}
        />
      )}
    </div>
  );
};
