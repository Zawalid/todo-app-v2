export function Colors({ customClass = '' }) {
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
      ></span>
    );
  });
}
