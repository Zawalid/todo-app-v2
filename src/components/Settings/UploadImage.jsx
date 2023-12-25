import { useFilePicker } from 'use-file-picker';

import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from 'use-file-picker/validators';
import { useUser } from '../../hooks';
import { toast } from 'sonner';
import { getInitialsAvatar } from '../../lib/appwrite/api';

export function UploadImage({ avatar, onChange }) {
  const { user } = useUser();
  const { openFilePicker } = useFilePicker({
    accept: ['.png', '.jpg'],
    readAs: 'DataURL',
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(['jpg', 'png']),
      new FileSizeValidator({ maxFileSize: 10 * 1024 * 1024 /* 10 MB */ }),
      new ImageDimensionsValidator({
        minHeight: 100,
        minWidth: 100,
      }),
    ],
    onFilesRejected: ({ errors }) => {
      errors.forEach((error) => {
        toast.error(getErrorMessage(error.name));
      });
    },
    onFilesSuccessfullySelected: ({ plainFiles, filesContent }) => {
      onChange({
        src: filesContent[0].content,
        file: plainFiles[0],
        type: 'uploaded',
      });
    },
  });

  const isInitialsAvatar = avatar?.includes('avatars/initials');

  return (
    <div className='flex items-center gap-5'>
      <img
        className='h-20 w-20 rounded-full border text-center text-xs text-text-tertiary '
        src={avatar ? avatar : user?.avatar}
        alt={user?.name}
      />
      <div>
        <div className='flex flex-wrap gap-y-2 gap-x-5'>
          <button
            className='flex-1 rounded-lg border px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors duration-300 hover:bg-indigo-600 hover:text-white'
            onClick={() => openFilePicker()}
          >
            Upload
          </button>
          <button
            className={
              'flex-1 rounded-lg min-w-[105px] border px-3 py-2 text-sm font-medium text-text-primary shadow-sm transition-colors duration-300  ' +
              (isInitialsAvatar ? 'bg-zinc-200 text-white' : 'hover:bg-indigo-600 hover:text-white')
            }
            disabled={isInitialsAvatar}
            onClick={async () => {
              onChange({ src: await getInitialsAvatar(user?.name), file: null, type: 'initials' });
            }}
          >
            Get Initials
          </button>
        </div>
        <p className='mb-1 mt-3 text-xs text-text-tertiary'>At least 100x100 px recommended.</p>
        <p className='text-xs text-text-tertiary'>JPG or PNG are allowed (Max size of 10MB)</p>
      </div>
    </div>
  );
}

function getErrorMessage(name) {
  switch (name) {
    case 'FileTypeError':
      return 'Only JPG and PNG are allowed';
    case 'ImageDimensionError':
      return 'Image must be at least 100x100 px';
    case 'FileSizeError':
      return 'Image must be at most 10 MB';
    default:
      return 'Something went wrong';
  }
}
