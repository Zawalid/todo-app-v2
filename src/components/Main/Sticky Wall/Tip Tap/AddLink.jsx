import { useState } from 'react';

export const AddLinkBox = ({ editor }) => {
  const [url, setUrl] = useState('');

  const handleSetLink = (url) => {
    const prevUrl = editor?.getAttributes('link')?.href;
    setUrl(prevUrl);
    
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
    <div className='relative'>
      <div className='modal'>
        <form onSubmit={(e) => handleSubmit(e)} className=' flex flex-col gap-1'>
          <label className='text-text-secondary'>Add link</label>
          <input
            className='rounded-md bg-background-secondary px-2 py-1 text-text-secondary focus:outline-none'
            type='text'
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
    </div>
  );
};
