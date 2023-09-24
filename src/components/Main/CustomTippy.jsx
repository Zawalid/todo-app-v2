import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function CustomTippy(props) {
  return <Tippy className='bg-text-secondary' theme='custom' {...props}  />;
}
