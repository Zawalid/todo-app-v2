export function CheckBox({ checked, onChange, id, className }) {
  return (
    <div className={'relative h-4 ' + className} onClick={(e) => e.stopPropagation()}>
      <input
        type='checkbox'
        className='task peer transition-none duration-0 '
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <i className='fas fa-check pointer-events-none absolute left-0 top-0 hidden h-5 w-5 text-center  text-sm text-white transition-none duration-0 peer-checked:block'></i>
    </div>
  );
}
