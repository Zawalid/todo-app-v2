import { useEffect, useRef, useState } from 'react';

export function useColorPicker(onChange) {
  const [isOpen, setIsOpen] = useState(false);
  const colorsDiv = useRef(null);

  useEffect(() => {
    function change(e) {
      const color = e.target.dataset.color;
      color && onChange(color);
    }
    const div = colorsDiv.current;
    if (isOpen) {
      div.addEventListener('click', change);
      return () => {
        div.removeEventListener('click', change);
      };
    }
  });

  return {
    isOpen,
    setIsOpen,
    colorsDiv,
  };
}
