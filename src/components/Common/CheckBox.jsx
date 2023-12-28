export function CheckBox({ checked, onChange, id }) {
  return (
    <div className='relative'>
      <input type='checkbox' className='task peer' id={id} checked={checked} onChange={onChange} />
      <i className='fas fa-check pointer-events-none  absolute left-1  top-1 hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
    </div>
  );
}
