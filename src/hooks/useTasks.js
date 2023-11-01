import { useContext } from 'react';
import { TasksContext } from '../contexts/Tasks';


export function useTasks() {
  return useContext(TasksContext);
}
