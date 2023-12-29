import { EditProfile } from './Account';
import { Password } from './Password';
import { Sessions } from './Sessions';

export function Content({ currentTab }) {
  const tabs = {
    account: <EditProfile />,
    password: <Password />,
    sessions: <Sessions />,
  };

  return <div className='flex flex-1 flex-col px-5 sm:px-8 py-4 sm:py-6 overflow-auto'>{tabs[currentTab]}</div>;
}
