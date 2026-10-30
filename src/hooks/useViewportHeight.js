import { useEffect } from 'react';

// Visual viewport follows the on-screen keyboard, unlike 100vh on mobile browsers.
export function useViewportHeight() {
  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => {
      if (!viewport || viewport.scale === 1) {
        document.documentElement.style.setProperty('--app-viewport-height', `${viewport?.height || window.innerHeight}px`);
      }
    };
    update();
    viewport?.addEventListener('resize', update);
    window.addEventListener('resize', update);
    return () => {
      viewport?.removeEventListener('resize', update);
      window.removeEventListener('resize', update);
      document.documentElement.style.removeProperty('--app-viewport-height');
    };
  }, []);
}
