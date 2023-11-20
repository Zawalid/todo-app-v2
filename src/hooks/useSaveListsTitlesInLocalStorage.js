import { useEffect, useState } from 'react';
import { useLists } from './useLists';

export function useSaveListsTitlesInLocalStorage() {
  const { lists } = useLists();
  const [listsTitles, setListsTitles] = useState(
    () => JSON.parse(localStorage.getItem('listsTitles')) || [],
  );

  useEffect(() => {
    const listsTitles = lists.map((list) => list.title);
    localStorage.setItem('listsTitles', JSON.stringify(listsTitles));
    setListsTitles(listsTitles);
  }, [lists]);

  return listsTitles;
}
