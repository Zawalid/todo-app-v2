import { useContext } from 'react';
import { SearchContext } from '../contexts/Search';


export function useSearch() {
    return useContext(SearchContext);
}
