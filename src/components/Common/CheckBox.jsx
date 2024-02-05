import { PiCheckBold } from 'react-icons/pi';

export function CheckBox({ className = '', ...props }) {
  return (
    <div className={'relative h-5 ' + className} onClick={(e) => e.stopPropagation()}>
      <input type='checkbox' className='peer transition-none duration-0 ' {...props} />
      <PiCheckBold className='pointer-events-none absolute left-[3px] top-0.5 text-sm hidden text-center   text-white transition-none duration-0 peer-checked:block' />
    </div>
  );
}
