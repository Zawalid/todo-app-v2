import { InputField } from '../Common/InputField';

export function TaskTitleAndNote({ taskTitle, setTaskTitle, taskNote, setTaskNote }) {
  return (
    <div className='mb-5'>
      <InputField
      type='text'
      placeholder='Task Title'
      value={taskTitle || ''}
      onChange={(e) => setTaskTitle(e.target.value)}
      className='text-sm bg-background-secondary'
      />
     
      <textarea
        className='mt-2 h-32 w-full resize-none  rounded-lg  border  border-zinc-200 bg-background-secondary p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
        placeholder='Note'
        value={taskNote || ''}
        onChange={(e) => setTaskNote(e.target.value)}
      ></textarea>
    </div>
  );
}
