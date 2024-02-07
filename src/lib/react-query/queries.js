import { useQuery } from '@tanstack/react-query';
import { GET_TASKS } from './keys';
import { getTask, getTasks } from '../appwrite/api/tasksApi';
import { useSelector } from 'react-redux';

//* Tasks Queries

export function useTasks() {
  const user = useSelector((state) => state.user.user);

  const { data, isPending, isError, error } = useQuery({
    queryKey: [GET_TASKS],
    queryFn: async () => await getTasks(user.$id),
  });

  return { tasks: data, isLoading: isPending, isError, error };
}

export function useTask(taskId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [[GET_TASKS, taskId]],
    queryFn: () => getTask(taskId),
  });

  return { task: data, isLoading: isPending, isError, error };
}

//* Lists Queries
