export function SpinnerLoader({ size }) {
  const sizeClass =
    size === 'small' ? 'h-6 w-6 after:h-6 after:w-6' : 'h-12 w-12 after:h-12 after:w-12';
  const borderClass =
    size === 'small' ? ' border-[3px] after:border-[3px] ' : ' border-[5px] after:border-[5px]';
  return (
    <span
      className={`loader animate-pulse2 after:animate-scaleUp absolute  inline-block  rounded-full  border-text-tertiary after:absolute after:left-1/2 after:top-1/2  after:inline-block -translate-x-1/2 -translate-y-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-text-tertiary 
       ${sizeClass} ${borderClass}`}
    ></span>
  );
}
