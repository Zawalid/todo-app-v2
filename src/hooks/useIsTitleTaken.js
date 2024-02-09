import { useEffect, useState } from 'react';
import { useLists } from '../lib/react-query/queries';

export function useIsTitleTaken(id, curTitle) {
  const { lists } = useLists();
  const [isNewTitleTaken, setIsNewTitleTaken] = useState(false);
  const [newTitle, setNewTitle] = useState(curTitle);
  const [error, setError] = useState('');

  useEffect(() => {
    const listWithSameTitle = lists?.find((list) => list.title?.trim() === newTitle?.trim());
    const isSameList = listWithSameTitle?.$id === id;

    let isTaken = listWithSameTitle;

    setError(isTaken ? 'List with the same title already exists.' : '');

    //make sure that the  newTitle doesn't contain symbols (except spaces and _ and -)
    const regex = /^[a-zA-Z0-9-_ ()]*$/;
    if (!regex.test(newTitle)) {
      isTaken = true;
      setError(isTaken ? 'List title can only contain (letters, numbers, spaces, _ , -).' : '');
    }

    // Make sure that the newTitle is not empty
    if (id) {
      if (newTitle?.trim() === '') {
        isTaken = true;
        setError(isTaken ? 'List title cannot be empty.' : '');
      }
      isSameList && (isTaken = false);
    }
    setIsNewTitleTaken(isTaken);
  }, [lists, id, newTitle]);

  return [isNewTitleTaken, setNewTitle, error];
}
