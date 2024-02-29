import Img from '../assets/Logo.svg';

export default function LoadingScreen() {
  return (
    <div className='fixed  grid h-full w-full place-content-center place-items-center  gap-4 bg-background-primary'>
      <img src={Img} alt='I Do' className='h-10 animate-pulse rounded-md shadow-md' />
    </div>
  );
}
