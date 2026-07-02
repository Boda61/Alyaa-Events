import { useState, useEffect, useRef, useCallback } from 'react';

export function useAnimationTimeline() {
  const [timeline, setTimeline] = useState({
    phase: 'initial', // initial, ambient, particles, content, complete
    progress: 0,
    elapsed: 0,
  });

  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  const startAnimation = useCallback(() => {
    startTimeRef.current = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTimeRef.current;
      const seconds = elapsed / 1000;

      let phase = 'initial';
      let progress = 0;

      if (seconds >= 5.5) {
        phase = 'complete';
        progress = 1;
      } else if (seconds >= 5.0) {
        phase = 'content';
        progress = (seconds - 5.0) / 0.5;
      } else if (seconds >= 3.5) {
        phase = 'particles';
        progress = (seconds - 3.5) / 1.5;
      } else if (seconds >= 2.0) {
        phase = 'ambient';
        progress = (seconds - 2.0) / 1.5;
      } else {
        phase = 'initial';
        progress = seconds / 2.0;
      }

      setTimeline({
        phase,
        progress: Math.min(progress, 1),
        elapsed: seconds,
      });

      if (seconds < 5.5) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = null;
    setTimeline({
      phase: 'initial',
      progress: 0,
      elapsed: 0,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    ...timeline,
    startAnimation,
    resetAnimation,
  };
}

export default useAnimationTimeline;