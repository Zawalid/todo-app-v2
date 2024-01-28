export function Colors({ customClass }) {
  return Array.from({ length: 18 }).map((_, i) => {
    const color = `--custom-${i + 1}`;
    return (
      <span
        key={color}
        className={`color ${customClass ? customClass : ''}`}
        style={{
          backgroundColor: `var(${color})`,
        }}
        data-color={color}
      ></span>
    );
  });
}
