import { useFilePicker } from 'use-file-picker';
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from 'use-file-picker/validators';
import { toast } from 'sonner';
import { getInitialsAvatar } from '../../../../lib/appwrite/api';
import { Controller, useWatch } from 'react-hook-form';
import { Button } from '../../../Common/Button';

export function UploadImage({ control, onChange, disabled }) {
  const { name, avatar } = useWatch({ control, name: 'account' }) || {};
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
  const isInitialsAvatar = avatar?.src.includes('avatars/initials');

  return (
    <div className='flex items-center gap-5'>
      <img
        className='h-20 w-20 rounded-full border border-border text-center text-xs text-text-tertiary '
        src={avatar?.src}
        alt={name}
      />
      <div>
        <div className='flex flex-wrap gap-x-5 gap-y-2'>
          <Button type='outline' className='flex-1' disabled={disabled} onClick={openFilePicker}>
            Upload
          </Button>
          <Button
            type='outline'
            className='flex-1'
            disabled={isInitialsAvatar || disabled}
            onClick={async () => {
              onChange({ src: await getInitialsAvatar(name), file: null, type: 'initials' });
            }}
          >
            Initials
          </Button>
        </div>
        <p className='mb-1 mt-3 text-xs text-text-tertiary'>At least 100x100 px recommended.</p>
        <p className='text-xs text-text-tertiary'>JPG or PNG are allowed (Max size of 10MB)</p>
      </div>
      <Controller
        name='account.avatar'
        control={control}
        render={({ field }) => <input type='hidden' value={field.value || {}} />}
      />
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
