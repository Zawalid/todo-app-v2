import { useEffect, useState } from 'react';

export function useLocalStorageState(key, initialState) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue
      ? key === 'tasks'
        ? new Map(JSON.parse(storedValue))
        : JSON.parse(storedValue)
      : initialState;
  });

  useEffect(
    function () {
      const jsonValue =
        key === 'tasks' ? JSON.stringify(Array.from(value.entries())) : JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    },
    [value, key],
  );

  return [value, setValue];
}
