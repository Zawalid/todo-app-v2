import { Controller, useWatch } from 'react-hook-form';
import papaparse from 'papaparse';
import { PiDownloadSimpleLight, PiListChecks } from 'react-icons/pi';
import { IoChevronDownOutline } from "react-icons/io5";
import { BsBraces, BsFiletypeCsv } from 'react-icons/bs';
import { TaskDueDate } from '../../../Task Info/TaskDueDate';
import { TaskPriority } from '../../../Task Info/TaskPriority';
import { DropDown } from '../../../Common/DropDown';
import Switch from '../../../Common/Switch';
import { CheckBox } from '../../../Common/CheckBox';
import { useLists, useTags, useTasks } from '../../../../hooks';
import { exportDownload } from '../../../../utils/helpers';

export function Tasks({ control, setValue }) {
  const tasksSettings = useWatch({ control, name: 'tasks' });
  const { weeklyDueDate, defaultDueDate, defaultPriority } = tasksSettings;

  const setSetting = (name, value) => setValue(`tasks.${name}`, value, { shouldDirty: true });

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
          <TaskDueDate
            taskDueDate={defaultDueDate || ''}
            setTaskDueDate={(date) => setSetting('defaultDueDate', date)}
            inSettings={true}
          />

          <Controller
            control={control}
            name='tasks.defaultDueDate'
            render={({ field }) => <input {...field} type='hidden' />}
          />
        </div>
        <div className='setting'>
          <div>
            <h4>Default Priority</h4>
            <p className='mt-2 text-xs text-text-secondary'>
              Initial priority for all new tasks. You can modify this for each task later.
            </p>
          </div>
          <TaskPriority
            taskPriority={defaultPriority}
            setTaskPriority={(priority) => setSetting('defaultPriority', priority)}
            inSettings={true}
          />
          <Controller
            control={control}
            name='tasks.defaultPriority'
            render={({ field }) => <input {...field} type='hidden' />}
          />
        </div>
        <div className='setting'>
          <div>
            <h4>Weekly Due Date</h4>
            <p>Tasks added in {'This Week'} will have their due date set to the selected day.</p>
          </div>
          <DropDown
            toggler={
              <DropDown.Toggler>
                <span>{weeklyDueDate}</span>
                <IoChevronDownOutline />
              </DropDown.Toggler>
            }
            options={{ className: 'w-48' }}
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => (
                <DropDown.Button
                  key={day}
                  isCurrent={day === weeklyDueDate}
                  onClick={() => setSetting('weeklyDueDate', day)}
                >
                  <span>{day}</span>
                </DropDown.Button>
              ),
            )}
          </DropDown>

          <Controller
            control={control}
            name='tasks.weeklyDueDate'
            render={({ field }) => <input {...field} type='hidden' />}
          />
        </div>
        <div className='setting'>
          <div>
            <h4>Auto Delete Completed Tasks</h4>
            <p>Automatically delete tasks once they are marked as completed.</p>
          </div>
          <Controller
            control={control}
            name='tasks.autoDeleteCompletedTasks'
            render={({ field }) => <Switch {...field} checked={field.value} />}
          />
        </div>
        <div className='setting'>
          <div>
            <h4>Task Detail Level</h4>
            <p>Choose the amount of detail displayed for each task.</p>
          </div>
          <TaskDisplay control={control} setSetting={setSetting} />
          <Controller
            control={control}
            name='tasks.taskDetailLevel'
            render={({ field }) => <input {...field} type='hidden' />}
          />
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

function TaskDisplay({ control, setSetting }) {
  const taskDetailLevel = useWatch({ control, name: 'tasks.taskDetailLevel' });
  const allDetails = ['list', 'dueDate', 'priority', 'subtasks', 'tags'];

  const setTaskDetailLevel = (detail) => {
    if (taskDetailLevel.includes(detail)) {
      return setSetting('taskDetailLevel', taskDetailLevel.filter((d) => d !== detail).sort());
    }
    setSetting('taskDetailLevel', [...taskDetailLevel, detail].sort());
  };

  return (
    <DropDown
      toggler={
        <DropDown.Toggler>
          <span>
            {allDetails.filter((detail) => taskDetailLevel.includes(detail)).length} of{' '}
            {allDetails.length} visible
          </span>
          <IoChevronDownOutline />
        </DropDown.Toggler>
      }
      options={{ className: 'w-48', shouldCloseOnClick: false }}
    >
      {allDetails.map((detail) => {
        return (
          <DropDown.Button
            key={detail}
            className='justify-between'
            onClick={() => setTaskDetailLevel(detail)}
          >
            <label htmlFor={detail} className='capitalize'>
              {detail}
            </label>
            <CheckBox
              id={detail}
              checked={taskDetailLevel.includes(detail)}
              onChange={() => setTaskDetailLevel(detail)}
            />
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
