import { useSelector } from 'react-redux';
import { MenuToggler } from '../Menu/Menu';

export function Title({ title, count }) {
  const { isMenuOpen } = useSelector((state) => state.user);

  return (
    <div className='mb-2 flex items-center  gap-5 overflow-x-auto'>
      {isMenuOpen || <MenuToggler />}
      <div className='flex items-center gap-5'>
        <h1 className='truncate text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl'>
          {title}
        </h1>
        {count >= 0 && (
          <span className='text-xsl rounded-lg border border-border px-2 py-1 font-semibold  text-text-primary sm:px-3 sm:py-2 sm:text-2xl md:text-3xl'>
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
