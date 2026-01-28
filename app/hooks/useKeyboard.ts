import { useEffect } from 'react';

interface KeyboardHandlers {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlers.onLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handlers.onRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          handlers.onDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          handlers.onRotate();
          break;
        case ' ':
          event.preventDefault();
          handlers.onHardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          handlers.onPause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, enabled]);
}
