import { useState } from 'react';
import CustomTippy from '../../../../../Common/CustomTippy';

export const AddLink = ({ editor,readonly }) => {
  const [url, setUrl] = useState('');

  const handleSetLink = (url) => {
    // cancelled
    if (url === null) return;
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSetLink(url);
    setUrl('');
  };
  return (
    <CustomTippy
      content={
        <div className='relative'>
          <form onSubmit={(e) => handleSubmit(e)} className='p-2 flex flex-col gap-1'>
            <label className='text-text-secondary'>Add link</label>
            <input
              className='rounded-md bg-background-secondary px-2 py-1 text-text-secondary focus:outline-none'
              type='text'
              name='url'
              placeholder='https://example.com'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className='
                bg-background-secondary text-text-secondary
              '
              onClick={() => handleSubmit}
              
            >
              Add
            </button>
          </form>
        </div>
      }
      theme='addLink'
      trigger='click'
      interactive={true}
      arrow={false}
      placement='bottom'
    >
      <button
        disabled={readonly || !editor.can().chain().focus().toggleLink().run()}
        className={editor.isActive('link') ? 'icon-button active' : 'icon-button not-active'}
        onClick={() => setUrl(editor.isActive('link') ? editor.getAttributes('link').href : '')}
      >
        <i className='fa-solid fa-link'></i>
      </button>
    </CustomTippy>
  );
};
