import { useEffect } from 'react';
import { PiCheckCircleFill, PiCircle } from 'react-icons/pi';
import { NavLink } from 'react-router-dom';
import { useFormatDateAndTime } from '../../../hooks/useFormatDateAndTime';

export function StickyNote({ stickyNote, onSelect, listView, isSelecting, isSelected }) {
  const { title, content, $createdAt = new Date(), bgColor, textColor } = stickyNote;
  const firstParagraph = content.match(/<p>([^<]*)<\/p>/)?.[1];
  const format = useFormatDateAndTime();

  useEffect(() => {
    document.documentElement.style.setProperty('--line-clamp', listView ? '1' : '8');
  }, [listView]);

  return (
    <NavLink
      to={isSelecting || `/app/sticky-wall/${stickyNote.$id}`}
      className={
        'group relative flex w-full flex-col gap-3 overflow-hidden rounded-lg px-5 py-3 shadow-[rgba(3_3_3_0.08)_0px_6px_16px] transition-[width,height] duration-300 ' +
        (listView ? 'h-[130px]' : 'h-[270px] ')
      }
      style={{
        backgroundColor: `var(${bgColor})`,
        color: textColor,
      }}
      onClick={() => isSelecting && onSelect()}
    >
      <div
        className={
          'grid w-full flex-1 space-y-3 transition-transform duration-300  group-hover:scale-[.95] ' +
          (!firstParagraph && !listView
            ? ' place-content-center'
            : 'place-content-start text-start')
        }
      >
        <h2 className='truncate text-xl font-bold sm:text-2xl'>{title || 'Untitled'}</h2>

        {firstParagraph && (
          <p className='note_text overflow-hidden text-xs font-medium text-text-secondary sm:text-sm '>
            {firstParagraph}
          </p>
        )}
      </div>

      <div className='flex h-7 w-full items-center justify-between transition-transform duration-300  group-hover:scale-[.95] '>
        <span
          className='text-[10px] font-medium sm:text-xs'
          style={{
            color: textColor,
          }}
        >
          {format(new Date($createdAt))}
        </span>

        <span
          className={'transition-transform duration-300 ' + (isSelecting ? 'scale-1' : 'scale-0')}
          style={{
            color: textColor,
          }}
        >
          {isSelected ? <PiCheckCircleFill size={20} /> : <PiCircle size={20} />}
        </span>
      </div>
    </NavLink>
  );
}
