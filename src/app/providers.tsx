'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ブラウザ拡張機能による属性の変更を検出してログに記録
    if (process.env.NODE_ENV === 'development') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName?.includes('data-')) {
            console.log(
              `Browser extension added attribute: ${mutation.attributeName} to`,
              mutation.target,
            );
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-redeviation-bs-uid'],
      });

      return () => observer.disconnect();
    }
  }, []);

  return <>{children}</>;
}
