import { useContext } from 'react';
import { TasksContext } from '../contexts/Tasks';

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) throw new Error('useTasks must be used within a TasksProvider');
  return context;
}
