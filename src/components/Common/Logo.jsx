import { Link } from 'react-router-dom';
import Img from '../../assets/Logo.svg';

export function Logo() {
  return (
    <Link className='flex items-center justify-center' to='/'>
      <img src={Img} alt='I Do' className='h-8 shadow-md rounded-md' />
      <span className='font-bold ml-2'>I Do</span>
    </Link>
  );
}
