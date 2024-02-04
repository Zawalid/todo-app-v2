import Account from './Tabs/account/Account';
import General from './Tabs/general/General';
import Password from './Tabs/Password';
import Sessions from './Tabs/Sessions';
import SideBar from './Tabs/SideBar';
import Theme from './Tabs/Theme';

export function Content({ currentTab }) {
  const tabs = {
    account: <Account />,
    password: <Password />,
    sessions: <Sessions />,
    general: <General />,
    theme: <Theme />,
    sidebar: <SideBar />,
  };

  return tabs[currentTab];
}
