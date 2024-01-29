import { Account } from './Account';
import { Password } from './Password';
import { Sessions } from './Sessions';

export function Content({ currentTab }) {
  const tabs = {
    account: <Account />,
    password: <Password />,
    sessions: <Sessions />,
  };

  return (
    <div className='flex flex-1 flex-col overflow-auto px-5 py-4 sm:px-8 sm:py-6'>
      {tabs[currentTab]}
    </div>
  );
}
