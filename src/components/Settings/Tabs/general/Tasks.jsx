import { PiDownloadSimpleLight, PiListChecks } from 'react-icons/pi';
import { BsBraces, BsFiletypeCsv } from 'react-icons/bs';
import { TaskDueDate } from '../../../Task Info/TaskDueDate';
import { TaskPriority } from '../../../Task Info/TaskPriority';
import { DropDown } from '../../../Common/DropDown';
import Switch from '../../../Common/Switch';
import { CheckBox } from '../../../Common/CheckBox';
import { useLists, useTags, useTasks } from '../../../../hooks';
import { exportDownload } from '../../../../utils/helpers';
import papaparse from 'papaparse';

export function Tasks() {
  return (
    <>
      <div className='flex items-center gap-3 text-text-tertiary'>
        <PiListChecks size={22} /> <h3 className='font-bold'>Tasks</h3>
      </div>
      <div className='space-y-5 md:pl-5'>
        <div className='setting'>
          <div>
            <h4>Default Due Date</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Initial due date for all new tasks. You can modify this for each task later.
            </p>
          </div>
          <TaskDueDate taskDueDate={new Date().toISOString().split('T')[0]} inSettings={true} />
        </div>
        <div className='setting'>
          <div>
            <h4>Default Priority</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Initial priority for all new tasks. You can modify this for each task later.
            </p>
          </div>
          <TaskPriority taskPriority={0} inSettings={true} />
        </div>
        <div className='setting'>
          <div>
            <h4>Auto Delete Completed Tasks</h4>
            <p>Automatically delete tasks once they are marked as completed.</p>
          </div>
          <Switch />
        </div>
        <div className='setting'>
          <div>
            <h4>Task Detail Level</h4>
            <p>Choose the amount of detail displayed for each task.</p>
          </div>
          <TaskDisplay />
        </div>
        <div className='setting'>
          <div>
            <h4>Export Tasks</h4>
            <p>Export all your tasks.</p>
          </div>
          <ExportTasks />
        </div>
      </div>
    </>
  );
}

function TaskDisplay() {
  const details = [
    {
      label: 'List',
      visible: true,
    },
    {
      label: 'Due Date',
      visible: true,
    },
    {
      label: 'Priority',
      visible: true,
    },
    {
      label: 'Subtasks',
      visible: false,
    },
    {
      label: 'Tags',
      visible: false,
    },
  ];

  return (
    <DropDown
      toggler={
        <DropDown.Toggler>
          <span>
            {details.filter((detail) => detail.visible).length} of {details.length} visible
          </span>
          <i className='fa-solid fa-chevron-down text-xs'></i>
        </DropDown.Toggler>
      }
      options={{ className: 'w-48', shouldCloseOnClick: false }}
    >
      {details.map((detail) => {
        return (
          <DropDown.Button key={detail.label} className='justify-between'>
            <label htmlFor={detail.label}>{detail.label}</label>
            <CheckBox id={detail.label} />
          </DropDown.Button>
        );
      })}
    </DropDown>
  );
}
function ExportTasks() {
  const { tasks } = useTasks();
  const { tags } = useTags();
  const { lists } = useLists();
  const updatedTasks = (isCsv) =>
    tasks.map((task) => {
      const { title, dueDate, note, listId, subtasks, isCompleted, tagsIds, priority } = task;
      const listName = lists.find((list) => list.$id === listId)?.title;
      const tagsNames = [];
      tagsIds.forEach((id) => {
        const tag = tags.find((tag) => tag.$id === id);
        if (tag) tagsNames.push(tag.title);
      });
      const newSubtasks = subtasks.map((sub) => {
        const { title, isCompleted } = JSON.parse(sub);
        return { title, isCompleted };
      });
      const newPriority =
        priority === 0 ? 'None' : priority === 1 ? 'Low' : priority === 2 ? 'Medium' : 'High';

      return {
        title,
        dueDate,
        note,
        list: listName,
        subtasks: isCsv ? JSON.stringify(newSubtasks) : newSubtasks,
        isCompleted,
        tags: tagsNames,
        priority: newPriority,
      };
    });

  return (
    <DropDown
      toggler={
        <DropDown.Toggler>
          <span>Export As</span>
          <PiDownloadSimpleLight />
        </DropDown.Toggler>
      }
    >
      <DropDown.Button
        className='text-center'
        onClick={() => exportAs(updatedTasks(false), 'json')}
      >
        <BsBraces />
        <span>JSON</span>
      </DropDown.Button>
      <DropDown.Button className='text-center' onClick={() => exportAs(updatedTasks(true), 'csv')}>
        <BsFiletypeCsv />
        <span>CSV</span>
      </DropDown.Button>
    </DropDown>
  );
}

const exportAs = (tasks, format) => {
  const json = JSON.stringify(tasks);
  const csv = papaparse.unparse(json, {});

  const blob = new Blob([format === 'json' ? json : csv], {
    type: format === 'json' ? 'application/json' : 'text/csv',
  });

  exportDownload(blob, `tasks.${format}`);
};
