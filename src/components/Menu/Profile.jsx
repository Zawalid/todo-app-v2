import { useUser } from '../../hooks';

export function Profile() {
  const { user } = useUser();

  return (
    <div className='flex flex-1 items-center gap-3'>
      <div
        className='h-8 w-8 rounded-full bg-cover'
        style={{
          backgroundImage: `url('${user?.avatar}')`,
        }}
      ></div>
      <div className='flex flex-col'>
        <span className='flex-1 text-sm font-semibold text-text-primary'>{user?.name}</span>
        <span className='text-xs font-medium text-text-tertiary '>{user?.email}</span>
      </div>
    </div>
  );
}
