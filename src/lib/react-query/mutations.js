import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ADD_LIST,
  ADD_TASK,
  DELETE_TASK,
  GET_LISTS,
  GET_TASKS,
  UPDATE_LIST,
  UPDATE_TASK,
} from './keys';
import { addList, addTask, deleteTask, deleteTasks, updateList, updateTask } from '../appwrite/api';

import completedSoundFile from '../../assets/completed.mp3';
import deleteSoundFile from '../../assets/deleted.mp3';
const completedSound = new Audio(completedSoundFile);
const deletedSound = new Audio(deleteSoundFile);

/* 
? To use normal mutation not an optimistic mutation : 

  -- onSuccess: (data, variables) => queryClient.setQueryData([queryKey], (oldData) => updateQueryFn(oldData, data, variables));

  -- useUpdateMutation :
  updateQueryFn: (oldData, data, variables) =>  oldData.map((item) => (item.$id === variables.id ? data : item));

  -- useDeleteMutation :
updateQueryFn: (oldData, data, variables) => oldData ? oldData.filter((item) => item.$id !== variables.id) : oldData,

  -- useDeleteAllMutation :
updateQueryFn: (oldData, data, variables) => oldData ? oldData.filter((item) => !variables.deleted.includes(item.$id)) : oldData,

  -- Reset the toasts messages

*/

function useMutationWithToast({
  mutationKey,
  queryKey,
  mutationFn,
  updateQueryFn,
  messages,
  onMutate,
  onSuccess,
  onError,
  isOptimistic = true,
}) {
  const user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();
  const toastId = useRef(null);

  const { mutate, isPending } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (variables) => await mutationFn({ ...variables, owner: user.$id }),

    onMutate: async (variables) => {
      if (onMutate) onMutate(variables);
      if (messages?.loading) {
        toastId.current = toast.loading(messages.loading);
      }

      if (isOptimistic) {
        await queryClient.cancelQueries({ queryKey: [queryClient] });
        const oldData = queryClient.getQueryData([queryKey]);
        queryClient.setQueryData([queryKey], (oldData) => updateQueryFn(oldData, variables));
        return { oldData };
      }
    },
    onSuccess: (data, variables) => {
      if (!isOptimistic) {
        queryClient.setQueryData([queryKey], (oldData) => updateQueryFn(oldData, variables, data));
      }
      if (onSuccess) onSuccess(data, variables);
      if (messages?.success) toast.success(messages.success, { id: toastId.current });
    },
    onError: (error, variables, context) => {
      if (isOptimistic) queryClient.setQueryData([queryKey], context.oldData);
      if (onError) onError(error);
      if (messages?.error) {
        toast.error(messages.error, {
          id: toastId.current,
          duration: 4000,
          action: {
            label: 'Try again',
            onClick: () => mutate(variables),
          },
        });
      }
    },
  });

  return { mutate, isLoading: isPending };
}

function useAddMutation(props) {
  return useMutationWithToast({
    ...props,
    isOptimistic: false,
    mutationFn: props.addItem,
    updateQueryFn: (oldData, variables, data) => (oldData ? [...oldData, data] : oldData),
  });
}

function useUpdateMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.updateItem,
    updateQueryFn: (oldData, variables) => {
      return oldData
        ? oldData.map((item) => (item.$id === variables.id ? {
          ...item,
          ...Object.values(variables)[1],
        } : item))
        : oldData;
    },
    messages: null,
  });
}

function useDeleteMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.deleteItem,
    updateQueryFn: (oldData, variables) =>
      oldData ? oldData.filter((item) => item.$id !== variables.id) : oldData,
    messages: null,
  });
}

function useDeleteAllMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.deleteAllItems,
    updateQueryFn: (oldData, variables) =>
      oldData ? oldData.filter((item) => !variables.deleted.includes(item.$id)) : oldData,

    isOptimistic: false,
  });
}

function useDeleteSound() {
  const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  const playDeleteSound = () => deletionSound && deletedSound.play();
  return playDeleteSound;
}

//* --- Tasks
// Add & Duplicate task
export function useAddTask({ isDuplicate } = {}) {
  return useAddMutation({
    mutationKey: ADD_TASK,
    queryKey: GET_TASKS,
    addItem: addTask,
    messages: {
      success: isDuplicate
        ? 'Task has been successfully duplicated.'
        : 'Task has been successfully added.',
      error: isDuplicate ? 'Failed to duplicate the task.' : 'Failed to add the task.',
      loading: isDuplicate ? 'Duplicating task...' : 'Adding task...',
    },
  });
}

// Update task
export function useUpdateTask() {
  return useUpdateMutation({
    mutationKey: UPDATE_TASK,
    queryKey: GET_TASKS,
    updateItem: updateTask,
    messages: {
      success: 'Task has been successfully updated.',
      error: 'Failed to update the task.',
      loading: 'Updating task...',
    },
  });
}

// Complete Task
export function useCompleteTask() {
  const {
    preferences: { taskCompletionSound },
    tasks: { autoDeleteCompletedTasks, deletePermanently },
  } = useSelector((state) => state.settings.general);

  const { mutate: deleteTask } = useDeleteTask({
    messages: null,
  });

  return useUpdateMutation({
    mutationKey: UPDATE_TASK,
    queryKey: GET_TASKS,
    updateItem: updateTask,
    messages: null,
    onMutate: (variables) => {
      if (taskCompletionSound && variables.task.isCompleted) completedSound.play();
    },
    onSuccess: (data, variables) => {
      if (autoDeleteCompletedTasks)
        deleteTask({ id: variables.id, deletePermanently: deletePermanently });
    },
  });
}

// Delete task
export function useDeleteTask(options) {
  const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  const playDeleteSound = useDeleteSound();

  return useDeleteMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_TASKS,
    deleteItem: deleteTask,
    messages: {
      success: 'Task has been successfully deleted.',
      error: 'Failed to delete the task.',
      loading: 'Deleting task...',
    },
    onSuccess: () => deletionSound && playDeleteSound(),
    ...options,
  });
}

// Delete All Tasks
export function useDeleteTasks() {
  const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  const playDeleteSound = useDeleteSound();

  return useDeleteAllMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_TASKS,
    deleteAllItems: deleteTasks,
    messages: {
      success: 'Tasks have been successfully deleted.',
      error: 'Failed to delete the tasks.',
      loading: 'Deleting tasks...',
    },
    onSuccess: () => deletionSound && playDeleteSound(),
  });
}

//* --- Lists
// Add list
export function useAddList() {
  return useAddMutation({
    mutationKey: ADD_LIST,
    queryKey: GET_LISTS,
    addItem: addList,
    messages: {
      success: 'List has been successfully added.',
      error: 'Failed to add the list.',
      loading: 'Adding list...',
    },
  });
}

// Update list
export function useUpdateList() {
  return useUpdateMutation({
    mutationKey: UPDATE_LIST,
    queryKey: GET_LISTS,
    updateItem: updateList,
    messages: {
      success: 'List has been successfully updated.',
      error: 'Failed to update the list.',
      loading: 'Updating list...',
    },
  });
}

// Delete list
export function useDeleteList() {
  return useDeleteMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_LISTS,
    deleteItem: deleteTask,
    messages: {
      success: 'List has been successfully deleted.',
      error: 'Failed to delete the list.',
      loading: 'Deleting list...',
    },
  });
}
