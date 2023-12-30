import { useEffect, useRef } from 'react';

export function useColorPicker(onChange) {
  const colorsDiv = useRef(null);

  useEffect(() => {
    function change(e) {
      div.querySelectorAll('.color').forEach((c) => c.classList.add('opacity-70'));
      e.target.classList.remove('opacity-70')
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
