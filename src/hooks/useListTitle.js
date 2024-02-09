import { useEffect, useMemo, useState } from 'react';
import { useLists } from '../lib/react-query/queries';

export function useListTitle(id, currentTitle) {
  const { lists } = useLists();
  const untitledLists = lists?.filter((l) => l.title.startsWith('Untitled')).map((l) => l.title);

  const defaultTitle = useMemo(() => {
    const untitledNumber = getTheUntitledNumber(untitledLists);
    const title = `Untitled ${untitledNumber > 0 ? `(${untitledNumber})` : ''}`;
    return title;
  }, [untitledLists]);

  const [newTitle, setNewTitle] = useState(currentTitle || defaultTitle);
  const [error, setError] = useState(null);

  useEffect(() => {
    const listWithSameTitle = lists?.find((list) => list.title?.trim() === newTitle?.trim());
    const isSameList = listWithSameTitle?.$id === id;
    const regex = /^[a-zA-Z0-9-_ ()]*$/;

    if (listWithSameTitle && !isSameList) setError('List with the same title already exists.');
    else if (!regex.test(newTitle)) setError('List title can only contain (letters, numbers, spaces, _ , -).');
    else if (newTitle.trim() === '') setError('List title cannot be empty.');
    else setError(null);
  }, [lists, id, newTitle]);

  return {
    newTitle,
    setNewTitle,
    defaultTitle,
    error,
  };
}

function getTheUntitledNumber(untitledLists) {
  // Extract the numbers from the untitled lists (e.g. Untitled (1) => 1)
  const untitledNumber = untitledLists?.map((l) => {
    const number = l.match(/\d+/g);
    return number ? +number[0] : 0;
  });
  // Sort the numbers in ascending order
  untitledNumber.sort((a, b) => a - b);
  // Get the last number
  const lastNumber = untitledNumber.at(-1);
  // Create an array of numbers from 0 to the last number
  const allNumbers = Array.from({ length: lastNumber }, (_, i) => i);
  // Find the missing numbers
  const missingNumbers = allNumbers.filter((n) => !untitledNumber.includes(n));
  // Return the first missing number or the last number + 1 if there are no missing numbers
  return missingNumbers.shift() ?? lastNumber + 1;
}
