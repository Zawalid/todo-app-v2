import { useAutoAnimate as animate } from '@formkit/auto-animate/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function useAutoAnimate(options) {
  const { animation } = useSelector((state) => state.settings.general.preferences);
  const [parent, enable] = animate(options);

  useEffect(() => {
    enable(animation);
  }, [animation, enable]);

  return [parent];
}
