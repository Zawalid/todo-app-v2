import { useEffect, useRef } from 'react';

export function useColorPicker(onChange) {
  const colorsDiv = useRef(null);

  useEffect(() => {
    function change(e) {
      const color = e.target.dataset.color;
      color && onChange(color);
    }
    const div = colorsDiv.current;
    div?.addEventListener('click', change);
    return () => {
      div?.removeEventListener('click', change);
    };
  });

  return colorsDiv;
}
