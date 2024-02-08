import { PiWarningBold } from 'react-icons/pi';

const priorities = {
  1: {
    label: 'Low',
    color: '#FFD700',
  },
  2: {
    label: 'Medium',
    color: '#c0ac3a',
  },
  3: {
    label: 'High',
    color: '#f92626',
  },
};

export function TaskPriority({ priority }) {
  if (!priority) return null;
  return (
    <div className='flex items-center gap-2'>
      <PiWarningBold
        style={{
          color: priorities[+priority].color,
        }} />
      <span className='text-xs font-semibold text-text-secondary'>
        {priorities[+priority].label}
      </span>
    </div>
  );
}
