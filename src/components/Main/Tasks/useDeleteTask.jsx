import { useState } from 'react';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import { useTasks } from '../../../hooks/useTasks';

export function useDeleteTask(id) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const { handleDeleteTask } = useTasks();
  return {
    Modal: isDeleteModalOpen ? (
      <ConfirmationModal
        sentence='Are you sure you want to delete this task?'
        confirmText='Delete'
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleDeleteTask(id, deletePermanently);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        element='Task'
        checked={deletePermanently}
        setChecked={setDeletePermanently}
      />
    ) : null,
    openModal: () => setIsDeleteModalOpen(true),
    isModalOpen: isDeleteModalOpen,
  };
}
