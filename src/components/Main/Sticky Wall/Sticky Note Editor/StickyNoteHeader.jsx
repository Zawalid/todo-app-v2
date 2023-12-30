import { InputField } from '../../../Common/InputField';

export function StickyNoteHeader({ isOpen, title, setTitle, description, setDescription }) {
  return (
    <div
      className={
        'space-y-2 border-b border-zinc-200 px-3 pt-4  ' + (isOpen ? 'h-[120px] py-3' : 'h-0')
      }
    >
      <InputField
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Title'
      />
      <InputField
        type='text'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Description'
      />
    </div>
  );
}
