import { useCallback, useState } from 'react';

export const useContainerDimensions = () => {
  const [rect, setRect] = useState();
  const ref = useCallback((node) => {
    if (node !== null) {
      const rect = node.getBoundingClientRect();
      setRect(rect);
    }
  }, []);
  return { rect, ref };
};
