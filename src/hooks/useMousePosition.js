import { useState, useEffect, useCallback } from 'react';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const updateMousePosition = useCallback((ev) => {
    const x = ev.clientX;
    const y = ev.clientY;
    const normalizedX = (x / window.innerWidth) * 2 - 1;
    const normalizedY = (y / window.innerHeight) * 2 - 1;

    setMousePosition({
      x,
      y,
      normalizedX,
      normalizedY,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [updateMousePosition]);

  return mousePosition;
}

export default useMousePosition;