export function StickyNote({
  title,
  content,
  bgColor,
  textColor,
  adder,
  onClick,
}) {
  return (
    <div
      className={
        'h-[270px] relative overflow-hidden group rounded-lg p-5 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] ' +
        (adder ? 'grid place-content-center' : '')
      }
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {adder && (
        <button onClick={onClick}>
          <i className='fas fa-plus cursor-pointer text-5xl text-text-primary'></i>
        </button>
      )}
      {!adder && (
        <>
          <h2 className='mb-3 text-2xl font-bold'>{title}</h2>
          <p className='h-40 overflow-auto pr-2 text-sm'>{content}</p>
          <button className="absolute -bottom-10 transition-[bottom] duration-500 group-hover:bottom-3 left-1/2 -translate-x-1/2" onClick={onClick}>
            <i className='fa-solid fa-eye cursor-pointer text-xl text-text-primary'></i>
          </button>
        </>
      )}
    </div>
  );
}
