import { useEffect, useState } from 'react';
import { useLists } from './useLists';

export function useSaveListsTitlesInLocalStorage() {
  const { lists } = useLists();
  const [listsTitles, setListsTitles] = useState(
    () => JSON.parse(localStorage.getItem('listsTitles')) || [],
  );

  useEffect(() => {
    if (!lists) return;
    const titles = lists?.map((list) => list.title);
    localStorage.setItem('listsTitles', JSON.stringify(titles));
    setListsTitles(titles);
  }, [lists]);

  return listsTitles;
}
