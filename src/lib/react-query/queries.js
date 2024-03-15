import { useQuery } from '@tanstack/react-query';
import { GET_LISTS, GET_TAGS, GET_TASKS, GET_STICKY_NOTES, GET_STICKY_NOTE } from './keys';
import {
  getLists,
  getStickyNoteById,
  getStickyNotes,
  getTags,
  getTasks,
  getTrashedLists,
  getTrashedStickyNotes,
  getTrashedTags,
  getTrashedTasks,
} from '../appwrite/api';
import { useSelector } from 'react-redux';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../../utils/Dates';

//* Tasks Queries

// All tasks
export function useTasks() {
  const { data, isPending, error } = useQuery({
    queryKey: [GET_TASKS],
    queryFn: async () => await getTasks(),
  });

  return { tasks: data, isLoading: isPending, error };
}

// Today tasks
export function useTodayTasks() {
  const { tasks, isLoading, error } = useTasks();
  const todayTasks = tasks?.filter((task) => checkIfToday(task.dueDate));

  return { todayTasks, isLoading, error };
}

// Upcoming tasks
export function useUpcomingTasks() {
  const { tasks, isLoading, error } = useTasks();
  const { weekStartsOn } = useSelector((state) => state.settings.general.dateAndTime);

  if (!tasks) return { upcomingTasks: [], isLoading, error };

  const todayTasks = tasks?.filter((task) => checkIfToday(task.dueDate));
  const tomorrowTasks = tasks?.filter((task) => checkIfTomorrow(task.dueDate));
  const thisWeekTasks = tasks?.filter((task) => isDateInCurrentWeek(task.dueDate, weekStartsOn));

  const upcomingTasks = [
    ...todayTasks,
    ...tomorrowTasks,
    ...thisWeekTasks.filter((t) => ![...todayTasks, ...tomorrowTasks].includes(t)),
  ];

  return { upcomingTasks, todayTasks, tomorrowTasks, thisWeekTasks, isLoading, error };
}

// Completed tasks
export function useCompletedTasks() {
  const { tasks, isLoading, error } = useTasks();
  const completedTasks = tasks?.filter((task) => task.isCompleted);

  return { completedTasks, isLoading, error };
}

// List tasks
export function useListTasks(listId) {
  const { tasks, isLoading, error } = useTasks();
  const listTasks = tasks?.filter((task) => task.listId === listId);

  return { listTasks, isLoading, error };
}

//* Lists Queries

// All lists
export function useLists() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [GET_LISTS],
    queryFn: async () => await getLists(),
  });

  return { lists: data, isLoading: isPending, isError, error };
}

//* Tags Queries

// All tags
export function useTags() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [GET_TAGS],
    queryFn: async () => await getTags(),
  });

  return { tags: data, isLoading: isPending, isError, error };
}

//* Sticky Notes Queries

// All sticky notes
export function useStickyNotes() {
  const { data, isPending,  error } = useQuery({
    queryKey: [GET_STICKY_NOTES],
    queryFn: async () => await getStickyNotes(),
  });

  return { stickyNotes: data, isLoading: isPending,  error };
}

// Get sticky note by id
export function useStickyNoteById(stickyNoteId) {
  const { defaultColor } = useSelector((state) => state.settings.general.stickyNotes);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: [GET_STICKY_NOTE, { stickyNoteId }],
    queryFn: async () => await getStickyNoteById(stickyNoteId),
    enabled: stickyNoteId !== 'new',
  });

  if (stickyNoteId === 'new')
    return {
      stickyNote: {
        title: '',
        content: '<p></p>',
        bgColor: defaultColor,
        textColor: '#fff',
        readonly: false,
        pinned: false,
        fontFamily: `'Lexend Deca', sans-serif`,
      },
    };

  return { stickyNote: data, isLoading: isPending, error, refetch };
}

//* Trash Queries

export function useTrashedTasks() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: [GET_TASKS, { type: 'trashed' }],
    queryFn: async () => await getTrashedTasks(),
  });

  return { trashedTasks: data, isLoading: isPending, error, refetch };
}

export function useTrashedLists() {
  const { data, isPending, error } = useQuery({
    queryKey: [GET_LISTS, { type: 'trashed' }],
    queryFn: async () => await getTrashedLists(),
  });

  return { trashedLists: data, isLoading: isPending, error };
}

export function useTrashedTags() {
  const { data, isPending, error } = useQuery({
    queryKey: [GET_TAGS, { type: 'trashed' }],
    queryFn: async () => await getTrashedTags(),
  });

  return { trashedTags: data, isLoading: isPending, error };
}

export function useTrashedStickyNotes() {
  const { data, isPending, error } = useQuery({
    queryKey: [GET_STICKY_NOTES, { type: 'trashed' }],
    queryFn: async () => await getTrashedStickyNotes(),
  });

  return { trashedStickyNotes: data, isLoading: isPending, error };
}
