import { useRef } from 'react';

export function useSwipe({ threshold = 100 }) {
  const startX = useRef(0);
  const startY = useRef(0);

 
  function onSwipeStart(e) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
}

  function onSwipeMove(e) {
    const diffX = startX.current - e.touches[0].clientX;
    const diffY = startY.current - e.touches[0].clientY;

    return { diffX, diffY };
  }
  
  function onSwipeLeft(e, callback) {
      const { diffX } = onSwipeMove(e);
    if (diffX > threshold) {
      callback();
    }
  }

  function onSwipeRight(e, callback) {
    const { diffX } = onSwipeMove(e);
    if (diffX < -threshold) {
      callback();
    }
  }

  function onSwipeUp(e, callback) {
    const { diffY } = onSwipeMove(e);
    if (diffY > threshold) {
      callback();
    }
  }

  function onSwipeDown(e, callback) {
    const { diffY } = onSwipeMove(e);
    if (diffY < -threshold) {
      callback();
    }
  }

  return {
    onSwipeStart,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  };
}
