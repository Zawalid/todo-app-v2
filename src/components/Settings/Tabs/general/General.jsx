import { Tab } from '../Tab';
import { StickyNotes } from './StickyNotes';
import { Tasks } from './Tasks';
import { Preferences } from './Preferences';
import { DateAndTime } from './DateAndTime';

export default function General() {
  return (
    <Tab>
      <div className='space-y-5 '>
        <Preferences />
        <hr className='border-border' />
        <DateAndTime />
        <hr className='border-border' />
        <Tasks />
        <hr className='border-border' />
        <StickyNotes />
      </div>
    </Tab>
  );
}
