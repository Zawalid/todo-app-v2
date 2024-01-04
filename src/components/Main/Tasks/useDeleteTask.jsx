import { useState } from 'react';
import { ConfirmationModal } from '../../Common/ConfirmationModal';
import { useTasks } from '../../../hooks/useTasks';

export function useDeleteTask(id) {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [deletePermanently, setDeletePermanently] = useState(false);
  const { handleDeleteTask } = useTasks();
  return {
    Modal: (
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        sentence='Are you sure you want to delete this task?'
        confirmText='Delete'
        onConfirm={() => {
          setIsConfirmationModalOpen(false);
          handleDeleteTask(id, deletePermanently);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
        element='Task'
        checked={deletePermanently}
        setChecked={setDeletePermanently}
      />
    ),
    openModal: () => setIsConfirmationModalOpen(true),
    isModalOpen: isConfirmationModalOpen,
  };
}
