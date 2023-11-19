import Tippy from '@tippyjs/react';
import { useUser } from '../../hooks';

export function Profile({ onOpenSettings }) {
  const { user, handleSignOut } = useUser();
  return (
    <div className='relative flex flex-1 items-center gap-2'>
      <div
        className='h-6 w-6 rounded-full bg-cover'
        style={{
          backgroundImage: `url('${user?.image}')`,
        }}
      ></div>
      <span className='flex-1 text-sm font-semibold text-text-primary '>{user?.name}</span>
      <Tippy
        content={
          <div>
            <span className='mb-2 block flex-1 border-b px-2 pb-2 pt-1 text-xs font-semibold text-text-tertiary '>
              {user?.email}
            </span>
            <button className=' flex items-center gap-3 px-2' onClick={onOpenSettings}>
              <i className='fa-solid fa-gear text-sm text-text-tertiary'></i>
              <span className='text-xs   text-text-secondary'>Settings</span>
            </button>
            <button className='mt-2 flex items-center gap-3 px-2' onClick={handleSignOut}>
              <i className='fa-solid fa-sign-out text-sm text-text-error'></i>
              <span className='text-xs  font-medium text-text-error'>Sign Out</span>
            </button>
          </div>
        }
        className=' absolute -left-[180px] w-[200px] rounded-lg  bg-background-primary shadow-md'
        trigger='click'
        interactive={true}
        arrow={false}
        placement='bottom'
      >
        <i className='fa-solid fa-chevron-down cursor-pointer text-xs text-text-tertiary'></i>
      </Tippy>
    </div>
  );
}
