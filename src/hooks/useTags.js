import { useContext } from 'react';
import { TagsContext } from '../contexts/Tags';


export function useTags() {
    const context = useContext(TagsContext);
    if (context === undefined) throw new Error('useTags must be used within a TagsProvider');
    return context;
}
