import { useSelector } from 'react-redux';
import deleteSoundFile from '../assets/deleted.mp3';
const deletedSound = new Audio(deleteSoundFile);

export function useDeleteSound() {
  const { deletionSound } = useSelector((state) => state.settings.general.preferences);

  const playDeleteSound = () => deletionSound && deletedSound.play();

  return playDeleteSound;
}
