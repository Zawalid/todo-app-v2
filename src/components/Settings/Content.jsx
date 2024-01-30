import { Account } from './Account';
import { Password } from './Password';
import { Sessions } from './Sessions';

export function Content({ currentTab }) {
  const tabs = {
    account: <Account />,
    password: <Password />,
    sessions: <Sessions />,
  };

  return tabs[currentTab];
}
