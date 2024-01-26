import { useEffect, useRef } from 'react';

export function useColorPicker(onChange, initialColor) {
  const colorsDiv = useRef(null);

  function changeOpacity(color) {
    colorsDiv.current.querySelectorAll('.color').forEach((c) => c?.classList.remove('border','border-primary','shadow-sm'));
    colorsDiv.current.querySelector(`[data-color="${color}"]`)?.classList.add('border','border-primary','shadow-sm');
  }

  useEffect(() => {
    const div = colorsDiv.current;
    if (!div) return;
    initialColor && changeOpacity(initialColor);

    function change(e) {
      const color = e.target.dataset.color;
      if (!color) return;
      changeOpacity(color);
      onChange(color);
    }
    div?.addEventListener('click', change);
    return () => div?.removeEventListener('click', change);
  });

  return colorsDiv;
}
