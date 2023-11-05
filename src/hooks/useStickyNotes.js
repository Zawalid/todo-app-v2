import { useContext } from "react";
import { StickyNotesContext } from "../contexts/StickyNotes";

export function useStickyNotes() {
    const context = useContext(StickyNotesContext)
    if(context === undefined) throw new Error('useStickyNotes must be used within a StickyNotesProvider');
    return context
}