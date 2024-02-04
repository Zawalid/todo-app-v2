import { PiCheckCircle, PiListBulletsFill , PiTag } from 'react-icons/pi';
import { FiInbox } from 'react-icons/fi';
import { IoCalendarOutline, IoTodayOutline } from 'react-icons/io5';
import { FaRegNoteSticky } from 'react-icons/fa6';

// eslint-disable-next-line react-refresh/only-export-components
export const TABS = {
  inbox: {
    name: 'inbox',
    icon: <FiInbox />,
  },
  completed: {
    name: 'completed',
    icon: <PiCheckCircle />,
  },
  stickyWall: {
    name: 'stickyWall',
    icon: <FaRegNoteSticky />,
  },
  today: {
    name: 'today',
    icon: <IoTodayOutline />,
  },
  upcoming: {
    name: 'upcoming',
    icon: <IoCalendarOutline />,
  },
  lists: {
    name: 'lists',
    icon: <PiListBulletsFill  />,
  },
  tags: {
    name: 'tags',
    icon: <PiTag />,
  },
};
