import { useEffect } from 'react';

import { DROP_INTERVAL } from '@/app/constants/tetrominos';

export function useGameLoop(onTick: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      onTick();
    }, DROP_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [onTick, isActive]);
}
