import { EditProfile } from './EditProfile';
import { Password } from './Password';
import { Sessions } from './Sessions';

export function Content({ currentTab }) {
  const tabs = {
    editProfile: <EditProfile />,
    password: <Password />,
    sessions: <Sessions />,
  };

  return <div className='flex-1 flex flex-col'>{tabs[currentTab]}</div>;
}
