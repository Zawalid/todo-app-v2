import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  GET_TASKS,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_LISTS,
  ADD_LIST,
  UPDATE_LIST,
  DELETE_LIST,
  GET_TAGS,
  ADD_TAG,
  DELETE_TAG,
  GET_STICKY_NOTES,
  ADD_STICKY_NOTE,
  UPDATE_STICKY_NOTE,
  DELETE_STICKY_NOTE,
  RESTORE_TASK,
  RESTORE_LIST,
  RESTORE_TAG,
  RESTORE_STICKY_NOTE,
  DELETE_TASK_PERMANENTLY,
  DELETE_LIST_PERMANENTLY,
  DELETE_TAG_PERMANENTLY,
  DELETE_STICKY_NOTE_PERMANENTLY,
} from './keys';
import {
  addList,
  addTag,
  addTask,
  deleteList,
  deleteTag,
  deleteTask,
  deleteTasks,
  updateList,
  updateTask,
  addStickyNote,
  updateStickyNote,
  deleteStickyNote,
  deleteStickyNotes,
  restoreTask,
  restoreList,
  restoreTag,
  restoreStickyNote,
  deleteTaskPermanently,
  deleteListPermanently,
  deleteTagPermanently,
  deleteStickyNotePermanently,
} from '../appwrite/api';

import completedSoundFile from '../../assets/completed.mp3';
import deleteSoundFile from '../../assets/deleted.mp3';
const completedSound = new Audio(completedSoundFile);
const deletedSound = new Audio(deleteSoundFile);

function useDeleteSound() {
  const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  const playDeleteSound = () => deletionSound && deletedSound.play();
  return playDeleteSound;
}

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
  const queryClient = useQueryClient();
  const toastId = useRef(null);
  const owner = localStorage.getItem('UID');

  const { mutate, isPending, data } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (variables) => await mutationFn({ ...variables, owner }),

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

  return { mutate, isLoading: isPending, data };
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
    mutationFn: props.updateItem,
    updateQueryFn: (oldData, variables) => {
      if (oldData) {
        return oldData.map((item) => {
          const updatedItem = props.isRestoring
            ? { ...item, isTrashed: false }
            : { ...item, ...Object.values(variables)[1] }; // This destructure the task or list...

          return item.$id === variables.id ? updatedItem : item;
        });
      }
      return oldData;
    },
    messages: null,
    ...props,
  });
}

function useDeleteMutation(props) {
  const { deletionSound } = useSelector((state) => state.settings.general.preferences);
  const playDeleteSound = useDeleteSound();

  return useMutationWithToast({
    ...props,
    mutationFn: props.deleteItem,
    updateQueryFn: (oldData, variables) =>
      oldData ? oldData.filter((item) => item.$id !== variables.id) : oldData,
    messages: null,
    onSuccess: () => {
      deletionSound && playDeleteSound();
      props.onSuccess?.();
    },
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

function useRestoreMutation({ mutationKey, queryKey, restoreItem }) {
  const queryClient = useQueryClient();
  return useUpdateMutation({
    mutationKey,
    queryKey: [queryKey, { type: 'trashed' }],
    updateItem: restoreItem,
    isRestoring: true,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      }),
  });
}

function useDeletePermanentlyMutation(mutationKey, deleteItem, queryKey) {
  const queryClient = useQueryClient();
  return useDeleteMutation({
    mutationKey,
    queryKey: [queryKey, { type: 'trashed' }],
    deleteItem,
    onSuccess: () => {
      /* 
      The Problem is that the queryKey is  being invalidated after the mutation is successful but kind of instantly so the re-fetched data is not updated 
      ! A Bad Solution !
      */
      setTimeout(
        () =>
          queryClient.invalidateQueries({
            queryKey: [queryKey],
          }),
        1000,
      );
    },
  });
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
  return useDeleteMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_TASKS,
    deleteItem: deleteTask,
    messages: {
      success: 'Task has been successfully deleted.',
      error: 'Failed to delete the task.',
      loading: 'Deleting task...',
    },
    ...options,
  });
}

// Delete All Tasks
export function useDeleteTasks() {
  return useDeleteAllMutation({
    mutationKey: DELETE_TASK,
    queryKey: GET_TASKS,
    deleteAllItems: deleteTasks,
    messages: {
      success: 'Tasks have been successfully deleted.',
      error: 'Failed to delete the tasks.',
      loading: 'Deleting tasks...',
    },
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
    mutationKey: DELETE_LIST,
    queryKey: GET_LISTS,
    deleteItem: deleteList,
    messages: {
      success: 'List has been successfully deleted.',
      error: 'Failed to delete the list.',
      loading: 'Deleting list...',
    },
  });
}

//* --- Tags
// Add tag
export function useAddTag() {
  return useAddMutation({
    mutationKey: ADD_TAG,
    queryKey: GET_TAGS,
    addItem: addTag,
    messages: {
      success: 'Tag has been successfully added.',
      error: 'Failed to add the tag.',
      loading: 'Adding tag...',
    },
  });
}

// Delete tag
export function useDeleteTag() {
  return useDeleteMutation({
    mutationKey: DELETE_TAG,
    queryKey: GET_TAGS,
    deleteItem: deleteTag,
    messages: {
      success: 'Tag has been successfully deleted.',
      error: 'Failed to delete the tag.',
      loading: 'Deleting tag...',
    },
  });
}

//* --- Sticky Notes
// Add sticky note
export function useAddStickyNote({ isDuplicate } = {}) {
  return useAddMutation({
    mutationKey: ADD_STICKY_NOTE,
    queryKey: GET_STICKY_NOTES,
    addItem: addStickyNote,
    messages: {
      success: isDuplicate
        ? 'Sticky note has been successfully duplicated.'
        : 'Sticky note has been successfully added.',
      error: isDuplicate
        ? 'Failed to duplicate the sticky note.'
        : 'Failed to add the sticky note.',
      loading: isDuplicate ? 'Duplicating sticky note...' : 'Adding sticky note...',
    },
  });
}

// Update sticky note
export function useUpdateStickyNote() {
  return useUpdateMutation({
    mutationKey: UPDATE_STICKY_NOTE,
    queryKey: GET_STICKY_NOTES,
    updateItem: updateStickyNote,
    messages: {
      success: 'Sticky note has been successfully updated.',
      error: 'Failed to update the sticky note.',
      loading: 'Updating sticky note...',
    },
  });
}

// Delete sticky note
export function useDeleteStickyNote() {
  return useDeleteMutation({
    mutationKey: DELETE_STICKY_NOTE,
    queryKey: GET_STICKY_NOTES,
    deleteItem: deleteStickyNote,
    messages: {
      success: 'Sticky note has been successfully deleted.',
      error: 'Failed to delete the sticky note.',
      loading: 'Deleting sticky note...',
    },
  });
}

// Delete All Sticky Notes
export function useDeleteStickyNotes() {
  return useDeleteAllMutation({
    mutationKey: DELETE_STICKY_NOTE,
    queryKey: GET_STICKY_NOTES,
    deleteAllItems: deleteStickyNotes,
    messages: {
      success: 'Sticky notes have been successfully deleted.',
      error: 'Failed to delete the sticky notes.',
      loading: 'Deleting sticky notes...',
    },
  });
}

//* --- Trash

// Restore element
export function useRestoreTask() {
  return useRestoreMutation({
    mutationKey: RESTORE_TASK,
    queryKey: GET_TASKS,
    restoreItem: restoreTask,
  });
}
export function useRestoreList() {
  return useRestoreMutation({
    mutationKey: RESTORE_LIST,
    queryKey: GET_LISTS,
    restoreItem: restoreList,
  });
}
export function useRestoreTag() {
  return useRestoreMutation({
    mutationKey: RESTORE_TAG,
    queryKey: GET_TAGS,
    restoreItem: restoreTag,
  });
}
export function useRestoreStickyNote() {
  return useRestoreMutation({
    mutationKey: RESTORE_STICKY_NOTE,
    queryKey: GET_STICKY_NOTES,
    restoreItem: restoreStickyNote,
  });
}

// Delete element
export function useDeleteTaskPermanently() {
  return useDeletePermanentlyMutation(DELETE_TASK_PERMANENTLY, deleteTaskPermanently, GET_TASKS);
}

export function useDeleteListPermanently() {
  return useDeletePermanentlyMutation(DELETE_LIST_PERMANENTLY, deleteListPermanently, GET_LISTS);
}

export function useDeleteTagPermanently() {
  return useDeletePermanentlyMutation(DELETE_TAG_PERMANENTLY, deleteTagPermanently, GET_TAGS);
}

export function useDeleteStickyNotePermanently() {
  return useDeletePermanentlyMutation(
    DELETE_STICKY_NOTE_PERMANENTLY,
    deleteStickyNotePermanently,
    GET_STICKY_NOTES,
  );
}
