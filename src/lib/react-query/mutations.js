import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { ADD_TASK, DELETE_TASK, GET_TASKS, UPDATE_TASK } from './keys';
import { addTask, deleteTask, deleteTasks, updateTask } from '../appwrite/api/tasksApi';
import { toast } from 'sonner';

import completedSoundFile from '../../assets/completed.mp3';
const completedSound = new Audio(completedSoundFile);

function useMutationWithToast({ mutationKey, queryKey, mutationFn, updateQueryFn, messages }) {
  const user = useSelector((state) => state.user.user);
  const queryClient = useQueryClient();
  let toastId;

  const { mutate, isPending, variables } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (variables) => await mutationFn({ ...variables, owner: user.$id }),

    onMutate: (variables) => {
      if (!messages) return;
      toast.loading(messages.loadingMessage, { id: toastId });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData([queryKey], (oldData) => updateQueryFn(oldData, data, variables));

      if (!messages) return;
      toast.dismiss(toastId);
      toast.success(messages.successMessage, { id: toastId });
    },
    onError: (error) => {
      if (!messages) return;
      toast.dismiss(toastId);
      toast.error(messages.errorMessage, {
        id: toastId,
        duration: 4000,
        action: {
          label: 'Try again',
          onClick: () => mutate(variables),
        },
      });
    },
  });

  return { mutate, isLoading: isPending };
}

function useAddMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.addItem,
    updateQueryFn: (oldData, data) => (oldData ? [...oldData, data] : oldData),
  });
}

function useUpdateMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.updateItem,
    updateQueryFn: (oldData, data) =>
      oldData ? oldData.map((item) => (item.$id === data.$id ? data : item)) : oldData,
  });
}

function useDeleteMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.deleteItem,
    updateQueryFn: (oldData, data, variables) =>
      oldData ? oldData.filter((item) => item.$id !== variables.id) : oldData,
  });
}

function useDeleteAllMutation(props) {
  return useMutationWithToast({
    ...props,
    mutationFn: props.deleteAllItems,
    updateQueryFn: (oldData, data, variables) =>
      oldData ? oldData.filter((item) => !variables.deleted.includes(item.$id)) : oldData,
  });
}

//* --- Tasks
// Add task
export function useAddTask() {
  return useAddMutation({
    mutationKey: ADD_TASK,
    queryKey: GET_TASKS,
    addItem: addTask,
    messages: {
      successMessage: 'Task has been successfully added.',
      errorMessage: 'Failed to add the task.',
      loadingMessage: 'Adding task...',
    },
  });
}

// Duplicate task
export function useDuplicateTask() {
  return useAddMutation({
    mutationKey: ADD_TASK,
    queryKey: GET_TASKS,
    addItem: addTask,
    messages: {
      successMessage: 'Task has been successfully duplicated.',
      errorMessage: 'Failed to duplicate the task.',
      loadingMessage: 'Duplicating task...',
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
      successMessage: 'Task has been successfully updated.',
      errorMessage: 'Failed to update the task.',
      loadingMessage: 'Updating task...',
    },
  });
}

// Complete Task
export function useCompleteTask() {
  // const {
  //   preferences: { taskCompletionSound },
  //   tasks: { autoDeleteCompletedTasks, deletePermanently },
  // } = useSelector((state) => state.settings.general);

  return useUpdateMutation({
    mutationKey: UPDATE_TASK,
    queryKey: GET_TASKS,
    updateItem: updateTask,
    messages: null,
  });
}

// Delete task
export function useDeleteTask() {
  // const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  // const playDeleteSound = useDeleteSound();

  return useDeleteMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_TASKS,
    deleteItem: deleteTask,
    messages: {
      successMessage: 'Task has been successfully deleted.',
      errorMessage: 'Failed to delete the task.',
      loadingMessage: 'Deleting task...',
    },
  });
}

// Delete All Tasks
export function useDeleteTasks() {
  // const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  // const playDeleteSound = useDeleteSound();

  return useDeleteAllMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_TASKS,
    deleteAllItems: deleteTasks,
    messages: {
      successMessage: 'Tasks have been successfully deleted.',
      errorMessage: 'Failed to delete the tasks.',
      loadingMessage: 'Deleting tasks...',
    },
  });
}
