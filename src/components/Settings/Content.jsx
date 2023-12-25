import { EditProfile } from './EditProfile';
import { Password } from './Password';
import { Sessions } from './Sessions';

export function Content({ currentTab }) {
  const tabs = {
    editProfile: <EditProfile />,
    password: <Password />,
    sessions: <Sessions />,
  };

  return <div className='flex flex-1 flex-col overflow-auto'>{tabs[currentTab]}</div>;
}
