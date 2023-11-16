import { Link } from 'react-router-dom';

export function Button({ isLoading, text }) {
  return (
    <button className='mx-auto flex w-full justify-center rounded-lg bg-text-secondary py-2 font-medium text-white'>
      {isLoading ? (
        <div className='flex items-center gap-3 text-white'>
          <i className='fa-solid fa-spinner animate-spin'></i>
          <span>{`${text.split(' ')[0]}ing ${text.split(' ')[1]}...`}</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
}

export function AuthLink({ text, link }) {
  return (
    <div className='flex items-center justify-center gap-2'>
      <p className='text-sm font-medium text-text-tertiary'>
        {text === 'Sign In' ? 'Already' : "Don't"} have an account?
      </p>
      <Link to={link} className='text-sm font-semibold text-text-primary'>
        {text}
      </Link>
    </div>
  );
}
