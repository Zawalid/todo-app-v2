import { useUserAuth } from '../../hooks';
import { Button } from './Button';

export function EditProfile() {
  const { user } = useUserAuth();
  return (
    <>
      <h2 className='text-2xl font-bold text-text-primary'>Edit Profile </h2>
      <div className='mt-8 space-y-5'>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Avatar</h3>
          <div className='flex items-center gap-5'>
            <div
              className='h-16 w-16 rounded-full bg-cover'
              style={{
                backgroundImage: `url('${user?.image}')`,
              }}
            ></div>
            <div>
              <button className='rounded-lg border px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors duration-300 hover:bg-background-tertiary'>
                Upload new image
              </button>
              <p className='mb-1 mt-3 text-xs text-text-tertiary'>
                At least 5OOx500 px recommended.
              </p>
              <p className='text-xs text-text-tertiary'>JPG or PNG and GIF is allowed</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Name</h3>
          <input
            type='text'
            className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
            value={user?.name
              .split(' ')
              .map((e) => e[0].toUpperCase() + e.slice(1))
              .join(' ')} />
        </div>
        <div>
          <h3 className='mb-3 font-bold text-text-secondary'>Email</h3>
          <input
            type='email'
            className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
            value={user?.email} />
        </div>
      </div>
      <Button text='Save Changes ' />
    </>
  );
}
