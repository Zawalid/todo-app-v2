import { PiCheckBold } from 'react-icons/pi';

export function Colors({ selectedColor, onSelect, customClass = '' }) {
  return Array.from({ length: 10 }).map((_, i) => {
    const color = `--custom-${i + 1}`;
    return (
      <span
        key={color}
        className={`color ${customClass}`}
        style={{
          backgroundColor: `var(${color})`,
        }}
        data-color={color}
        onClick={() => onSelect?.(color)}
      >
        {selectedColor === color && <PiCheckBold size={12} color='white' />}
      </span>
    );
  });
}
