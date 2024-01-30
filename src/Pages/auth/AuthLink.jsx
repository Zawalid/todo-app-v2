import { Link } from 'react-router-dom';


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
