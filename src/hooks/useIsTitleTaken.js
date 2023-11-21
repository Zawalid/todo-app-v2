import { useEffect, useState } from 'react';
import { useLists } from './useLists';

export function useIsTitleTaken(id, curTitle) {
  const { lists } = useLists();
  const [isNewTitleTaken, setIsNewTitleTaken] = useState(false);
  const [title, setTitle] = useState(curTitle);

  useEffect(() => {
    const listWithSameTitle = lists?.find((list) => list.title?.trim() === title?.trim());

    const isSameList = listWithSameTitle?.$id === id;
    let isTaken = listWithSameTitle;
    //make sure that the  title doesn't contain symbols (except spaces and _ and -)
    const regex = /^[a-zA-Z0-9-_ ()]*$/;
    if (!regex.test(title)) isTaken = true;
    if (id) {
      title?.trim() === '' && (isTaken = true);
      isSameList && (isTaken = false);
    }
    setIsNewTitleTaken(isTaken);
  }, [lists, id, title]);

  return [isNewTitleTaken, setTitle];
}
