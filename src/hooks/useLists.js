import { useContext } from 'react';
import { ListsContext } from '../contexts/Lists';

export function useLists() {
  const context = useContext(ListsContext);
  if (context === undefined) throw new Error('useLists must be used within a ListsProvider');
  return context;
}
