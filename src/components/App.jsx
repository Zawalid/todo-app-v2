import { useEffect, useMemo, useRef, useState } from 'react';
import '../App.css';
import { AddTask } from './AddTask';
import { useLocalStorageState } from '../useLocalStorageState';
import { BigTitle } from './Upcoming';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useLocalStorageState('todayTasks', [
    {
      id: Math.random(),
      title: 'Consult accountant',
      description: '',
      dueDate: '',
      listId: 'none',
      subtasks: [],
      isCompleted: true,
    },
  ]);
  const [currentTask, setCurrentTask] = useState(null);
  const [lists, setLists] = useLocalStorageState('lists', [
    {
      id: Math.random(),
      title: 'Personal',
      color: '#ff6b6b',
      tasks: [],
    },
    {
      id: Math.random(),
      title: 'Work',
      color: '#66d9e8',
      tasks: [],
    },
  ]);

  function handlerAddTask(title) {
    const newTask = {
      id: Math.random(),
      title,
      description: '',
      dueDate: '',
      listId: '',
      subtasks: [],
      isCompleted: false,
    };
    setTodayTasks((prev) => [...prev, newTask]);
  }
  function handleOpenTask(task) {
    setCurrentTask(task);
    setIsTaskInfoOpen(true);
  }
  function handleEditTask(task) {
    setTodayTasks((prev) => {
      const index = prev.findIndex((t) => t.id === task.id);
      prev[index] = task;
      return [...prev];
    });
    setIsTaskInfoOpen(false);
  }
  function handleDeleteTask(id) {
    setTodayTasks((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      prev.splice(index, 1);
      return [...prev];
    });
    const newLists = lists.map((list) => {
      const tasks = list.tasks.filter((t) => t.id !== id);
      return { ...list, tasks };
    });
    setLists(newLists);
    setIsTaskInfoOpen(false);
  }
  function handleCompleteTask(id, isCompleted) {
    const newTasks = todayTasks.map((task) => (task.id === id ? { ...task, isCompleted } : task));
    setTodayTasks(newTasks);
  }
  function handleAddList(title, color) {
    const newList = {
      id: Math.random(),
      title,
      color,
      tasks: [],
    };
    setLists((prev) => [...prev, newList]);
  }
  function handleAddTasksToList(listTitle, task) {
    const newLists = lists
      .map((list) => {
        const tasks = list.tasks.filter((t) => t.id !== task.id);
        return { ...list, tasks };
      })
      .map((list) => {
        return list.title === listTitle ? { ...list, tasks: [...list.tasks, task] } : list;
      });
    setLists(newLists);
  }
  function handleRenameList(id, title) {
    const newLists = lists.map((list) => (list.id === id ? { ...list, title } : list));
    setLists(newLists);
  }
  function handleDeleteList(id) {
    const newLists = lists.filter((list) => list.id !== id);
    setLists(newLists);
  }

  return (
    <div className='flex h-full gap-2 bg-background-primary p-5'>
      <Menu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        lists={lists}
        onAddList={handleAddList}
        todayTasksNumber={todayTasks.length}
        onRenameList={handleRenameList}
        onDeleteList={handleDeleteList}
      />
      <Main>
        <BigTitle title='Today' count={todayTasks.length} />
        <Today
          todayTasks={todayTasks}
          onAdd={handlerAddTask}
          onOpen={handleOpenTask}
          onComplete={handleCompleteTask}
          lists={lists}
        />
      </Main>
      <TaskInfo
        isOpen={isTaskInfoOpen}
        onClose={() => setIsTaskInfoOpen(false)}
        task={currentTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        lists={lists}
        onSelectList={handleAddTasksToList}
      />
    </div>
  );
}

function Menu({
  isOpen,
  setIsOpen,
  todayTasksNumber,
  lists,
  onAddList,
  onRenameList,
  onDeleteList,
}) {
  return (
    <aside
      className={
        'flex flex-col overflow-y-auto rounded-xl  p-4  transition-[width]  duration-500   ' +
        (isOpen
          ? 'w-[22%] items-stretch bg-background-secondary '
          : 'w-0 items-center bg-background-primary  ')
      }
    >
      {isOpen || (
        <button onClick={() => setIsOpen(true)}>
          <i className='fa-solid fa-bars cursor-pointer text-text-secondary'></i>
        </button>
      )}
      {isOpen && (
        <>
          <div className='flex  items-center justify-between'>
            <h2 className='text-xl font-bold text-text-secondary'>Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-secondary'></i>
            </button>
          </div>
          <div className='relative my-5 w-full'>
            <i className='fas fa-search absolute left-3 top-[5px] text-sm text-text-tertiary'></i>
            <input
              type='text'
              className='w-full rounded-lg border border-background-tertiary  bg-transparent  py-1 pl-10  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
              placeholder='Search'
            />
          </div>
          <MenuTasks todayTasksNumber={todayTasksNumber} />
          <Lists
            lists={lists}
            onAddList={onAddList}
            onRenameList={onRenameList}
            onDeleteList={onDeleteList}
          />
          <div className='mb-16'>
            <h4 className='mb-4 mt-5 font-medium text-text-secondary'>Tags</h4>
            <ul className='flex flex-wrap gap-2'>
              <li className='menu_tag_element bg-[#d1eaed]'>Tag 1</li>
              <li className='menu_tag_element bg-[#ffdada]'>Tag 2</li>
              <li className='menu_tag_element bg-background-tertiary'>+ Add Tag</li>
            </ul>
          </div>
          <div className='mt-auto'>
            <ul className='space-y-3'>
              <li className='grid cursor-pointer grid-cols-[25px_auto] items-center'>
                <i className='fa-solid fa-sliders text-text-tertiary'></i>
                <span className='text-text-secondary'>Settings</span>
              </li>
              <li className='grid cursor-pointer grid-cols-[25px_auto] items-center'>
                <i className='fa-solid fa-right-from-bracket text-text-tertiary'></i>
                <span className='text-text-secondary'>Log Out</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </aside>
  );
}
function Main({ children }) {
  return (
    <main className='flex flex-1 flex-col overflow-y-auto rounded-xl bg-background-primary px-5 '>
      {children}
    </main>
  );
}
function TaskInfo({ isOpen, onClose, task, onEdit, onDelete, lists, onSelectList }) {
  const [taskTitle, setTaskTitle] = useState();
  const [taskDescription, setTaskDescription] = useState();
  const [taskListId, setTaskListId] = useState('none');
  const [taskDueDate, setTaskDueDate] = useState();
  const [taskSubtasks, setTaskSubtasks] = useState();
  const [isChanged, setIsChanged] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setTaskTitle(task?.title);
      setTaskDescription(task?.description);
      setTaskListId(task?.listId);
      setTaskDueDate(task?.dueDate);
      setTaskSubtasks(task?.subtasks);
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskListId('');
      setTaskDueDate('');
      setTaskSubtasks([]);
    }
  }, [task, isOpen]);
  useEffect(() => {
    if (isOpen)
      task?.title !== taskTitle ||
      task?.description !== taskDescription ||
      task?.listId !== taskListId ||
      task?.dueDate !== taskDueDate ||
      task?.subtasks?.length !== taskSubtasks?.length ||
      task?.subtasks.some((subtask, index) => {
        return (
          subtask.title !== taskSubtasks[index].title ||
          subtask.isCompleted !== taskSubtasks[index].isCompleted
        );
      })
        ? setIsChanged(true)
        : setIsChanged(false);
  }, [isOpen, task, taskTitle, taskDescription, taskListId, taskDueDate, taskSubtasks]);

  function handleAddSubTask(title) {
    const newSubtask = {
      id: Math.random(),
      title,
      isCompleted: false,
    };
    setTaskSubtasks((prev) => [...prev, newSubtask]);
  }
  function handleSaveChanges() {
    if (isChanged) {
      const editedTask = {
        ...task,
        title: taskTitle,
        description: taskDescription,
        listId: taskListId,
        dueDate: taskDueDate,
        subtasks: taskSubtasks,
      };
      onEdit(editedTask);
      onSelectList(taskListId, editedTask);
    }
  }
  function handleEditSubtask(id, title) {
    const newSubtasks = taskSubtasks
      .map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask))
      .filter((subtask) => subtask.title !== '');
    setTaskSubtasks(newSubtasks);
  }
  function handleDeleteSubtask(id) {
    const newSubtasks = taskSubtasks.filter((subtask) => subtask.id !== id);
    setTaskSubtasks(newSubtasks);
  }
  function handleCompleteSubTask(id, isCompleted) {
    const newSubtasks = taskSubtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, isCompleted } : subtask,
    );
    setTaskSubtasks(newSubtasks);
  }
  return (
    <aside
      className={
        'ml-auto flex flex-col overflow-y-auto rounded-xl transition-[width] duration-500 ' +
        (isOpen
          ? 'w-[30%] items-stretch bg-background-secondary  p-4'
          : 'w-0 items-center bg-background-primary p-0')
      }
    >
      {isOpen && (
        <>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-text-secondary'>Task:</h2>
            <button onClick={onClose}>
              <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-secondary'></i>
            </button>
          </div>
          <div className='my-5'>
            <input
              type='text'
              className='w-full rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
              placeholder='Task Title'
              value={taskTitle || ''}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <textarea
              className='mt-2 h-32 w-full resize-none  rounded-lg  border  border-background-tertiary bg-transparent p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
              placeholder='Description'
              value={taskDescription || ''}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <div className='grid grid-cols-[1fr_3fr] items-center space-y-2'>
            <label className='text-sm text-text-tertiary'>List</label>
            <select
              className='w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none'
              value={taskListId}
              onChange={(e) => setTaskListId(e.target.value)}
            >
              <option value='none'></option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </select>
            <label className='text-sm text-text-tertiary'>Due date</label>
            <input
              type='date'
              className='w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none'
              min={today}
              value={taskDueDate || ''}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <label className='text-sm text-text-tertiary'>Tags</label>
            <ul className='flex flex-wrap gap-2'>
              <li className='menu_tag_element bg-[#d1eaed]'>Tag 1</li>
              <li className='menu_tag_element bg-background-tertiary'>+ Add Tag</li>
            </ul>
          </div>
          <div className='my-7 min-h-[300px] flex-shrink-0 overflow-y-auto'>
            <h2 className='mb-4 text-xl font-bold text-text-secondary'>Subtasks:</h2>
            <div className='flex items-center gap-3 border-b border-background-tertiary px-3 py-1'>
              <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
              <AddTask onAdd={handleAddSubTask} />
            </div>
            <ul className='mt-3 space-y-2 px-3'>
              {taskSubtasks?.map((subtask) => (
                <SubTask
                  key={subtask.id}
                  title={subtask.title}
                  onDelete={() => handleDeleteSubtask(subtask.id)}
                  onEdit={(title) => handleEditSubtask(subtask.id, title)}
                  isCompleted={subtask.isCompleted}
                  onComplete={(isCompleted) => handleCompleteSubTask(subtask.id, isCompleted)}
                />
              ))}
            </ul>
          </div>
          <div className='mt-auto flex gap-3'>
            <button
              className='flex-1 cursor-pointer rounded-lg border border-background-tertiary bg-red-500 py-2 text-center text-sm font-semibold text-background-secondary'
              onClick={() => onDelete(task.id)}
            >
              Delete Task
            </button>
            <button
              className={
                'flex-1 rounded-lg border border-background-tertiary py-2 text-center  text-sm font-semibold transition-colors duration-500 ' +
                (isChanged
                  ? 'cursor-pointer bg-indigo-400 text-background-secondary '
                  : 'cursor-not-allowed bg-background-tertiary text-text-tertiary')
              }
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
function Today({ todayTasks, onAdd, onOpen, onComplete, lists }) {
  return (
    <>
      <div>
        <div className='flex items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1'>
          <i className='fa-solid fa-plus text-xl text-text-tertiary'></i>
          <AddTask onAdd={onAdd} />
        </div>
        <ul className='mt-3 space-y-2'>
          {todayTasks.map((task) => (
            <Task
              key={task.id}
              title={task.title}
              dueDate={task.dueDate}
              subtasksNumber={task.subtasks.length}
              listId={task.listId}
              onOpen={() => onOpen(task)}
              isCompleted={task.isCompleted}
              onComplete={(isCompleted) => onComplete(task.id, isCompleted)}
              lists={lists}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

function MenuTasks({ todayTasksNumber }) {
  return (
    <div className='pb-5'>
      <h4 className='mb-4 mt-5  font-medium text-text-secondary'>Tasks</h4>
      <ul className='space-y-1'>
        <li className='menu_element group'>
          <i className='fas fa-angles-right text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            Upcoming
          </span>
          <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>12</span>
          </div>
        </li>
        <li className='menu_element active group'>
          <i className='fas fa-list-check text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            Today
          </span>
          <div className='grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary'>
            <span className='text-xs font-semibold text-text-secondary'>{todayTasksNumber}</span>
          </div>
        </li>
        <li className='menu_element group'>
          <i className='fas fa-note-sticky text-text-tertiary'></i>
          <span className='text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold'>
            Sticky Wall
          </span>
        </li>
      </ul>
    </div>
  );
}
function Task({ title, dueDate, subtasksNumber, listId, onOpen, isCompleted, onComplete, lists }) {
  const [checked, setChecked] = useState(isCompleted);
  const listName = useMemo(() => lists.find((l) => l?.id === +listId)?.title, [listId, lists]);
  const listColor = useMemo(
    () => lists.find((l) => l?.title === listName)?.color,
    [listName, lists],
  );

  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li
      className={
        'flex items-center justify-between  gap-3 rounded-lg border-b  border-background-tertiary px-5 py-2 transition-colors duration-500 ' +
        (checked ? 'bg-background-secondary' : '')
      }
    >
      <div className='relative'>
        <input
          type='checkbox'
          className='task peer'
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <i className='fas fa-check pointer-events-none  absolute left-1  top-1 hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
      </div>
      <div className='flex-1'>
        <span className='text-sm font-medium text-text-secondary'>{title}</span>
        <div className='mt-2 flex flex-wrap items-center gap-5'>
          {dueDate && (
            <div className='flex items-center gap-2'>
              <i className='fas fa-calendar-alt text-text-tertiary'></i>
              <span className='text-xs font-semibold text-text-secondary'>{dueDate}</span>
            </div>
          )}
          {subtasksNumber > 0 && (
            <div className='flex items-center gap-2'>
              <span className='rounded-sm bg-background-tertiary px-3 py-[1px] text-xs font-semibold text-text-secondary'>
                {subtasksNumber}
              </span>
              <span className='text-xs font-semibold text-text-secondary'>Subtasks</span>
            </div>
          )}
          {listId && listId !== 'none' && (
            <div className='flex items-center gap-2'>
              <span className='h-4 w-4 rounded-sm' style={{ backgroundColor: listColor }}></span>
              <span className='text-xs font-semibold text-text-secondary'>{listName}</span>
            </div>
          )}
        </div>
      </div>
      <button onClick={onOpen}>
        <i className='fa-solid fa-chevron-right cursor-pointer text-text-tertiary'></i>
      </button>
    </li>
  );
}
function SubTask({ title, onEdit, onDelete, isCompleted, onComplete }) {
  const [checked, setChecked] = useState(isCompleted);
  const subTaskEl = useRef(null);

  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  function editSubTask() {
    function saveTitle() {
      subTaskEl.current.setAttribute('contenteditable', false);
      onEdit(subTaskEl.current.innerText);
    }
    subTaskEl.current.setAttribute('contenteditable', true);
    subTaskEl.current.focus();
    subTaskEl.current.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveTitle();
      }
    });
    subTaskEl.current.addEventListener('blur', () => saveTitle());
  }
  return (
    <li className='flex items-center gap-3'>
      <div className='relative'>
        <input
          type='checkbox'
          className='subtask peer'
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <i className='fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block'></i>
      </div>
      <p
        className={
          'border-1 flex-1 text-sm font-medium text-text-secondary  focus:border-background-tertiary focus:outline-none ' +
          (checked ? 'line-through' : '')
        }
        ref={subTaskEl}
      >
        {title}
      </p>
      <div className='flex items-center gap-2'>
        <button onClick={editSubTask}>
          <i className='fas fa-pen cursor-pointer text-xs text-text-tertiary'></i>
        </button>
        <button onClick={onDelete}>
          <i className='fas fa-trash cursor-pointer text-xs text-text-tertiary'></i>
        </button>
      </div>
    </li>
  );
}

function Lists({ lists, onAddList, onRenameList, onDeleteList }) {
  const [isAddNewListOpen, setIsAddNewListOpen] = useState(false);
  const addNewListContainer = useRef(null);
  const addNewListToggler = useRef(null);
  const [duplicatedList, setDuplicatedList] = useState({});

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        addNewListContainer.current &&
        !addNewListContainer.current.contains(e.target) &&
        addNewListToggler.current &&
        !addNewListToggler.current.contains(e.target)
      ) {
        setIsAddNewListOpen(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function handleDuplicateLists(list) {
    console.log(list);
    setDuplicatedList(list);
    setTimeout(() => setDuplicatedList({}), 3000);
  }

  return (
    <div className='border-y border-background-tertiary pb-5'>
      <h4 className='mb-4 mt-5  font-medium text-text-secondary'>Lists</h4>
      <ul className='max-h-[300px] space-y-1 '>
        {lists.map((list) => (
          <List
            key={list.id}
            title={list.title}
            color={list.color}
            tasksNumber={list.tasks.length}
            alreadyExists={list.title?.toLowerCase() === duplicatedList.title?.toLowerCase()}
            onRename={(title) => onRenameList(list.id, title)}
            onDelete={() => onDeleteList(list.id)}
          />
        ))}
      </ul>
      <button
        className='my-4 flex cursor-pointer items-center text-sm text-text-secondary'
        ref={addNewListToggler}
        onClick={() => setIsAddNewListOpen(!isAddNewListOpen)}
      >
        <i className='fas  fa-plus w-10 text-text-tertiary'></i>
        Add New List
      </button>
      {isAddNewListOpen && (
        <AddNewList
          reference={addNewListContainer}
          isOpen={isAddNewListOpen}
          onAdd={onAddList}
          lists={lists}
          onDuplicate={handleDuplicateLists}
        />
      )}
    </div>
  );
}
function List({ title, color, tasksNumber, alreadyExists, onRename, onDelete }) {
  const [isListActionsOpen, setIsListActionsOpen] = useState(false);
  const listActions = useRef(null);
  const listTitle = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (listActions.current && !listActions.current.contains(event.target)) {
        setIsListActionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [listActions]);
  function closeListActions() {
    setIsListActionsOpen(false);
  }
  return (
    <li
      className={
        'menu_element group grid-cols-[30px_auto_35px_20px]' + (alreadyExists ? 'bg-red-400' : '')
      }
    >
      <div className='h-4 w-4 rounded-[3px]' style={{ backgroundColor: color }}></div>
      <span
        className={
          'first-line: text-sm outline-none transition-[color_font-weight] duration-100 group-hover:font-bold' +
          (alreadyExists ? 'text-white' : 'text-text-secondary')
        }
        ref={listTitle}
      >
        {title}
      </span>
      <div className='ml-1 grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300 group-hover:bg-background-primary'>
        <span className='text-xs font-semibold text-text-secondary'>{tasksNumber}</span>
      </div>
      <div className='cursor-pinter relative text-end'>
        <i
          className='fas fa-ellipsis-vertical text-text-tertiary'
          onClick={() => setIsListActionsOpen(true)}
        ></i>
        <ListAction
          isOpen={isListActionsOpen}
          reference={listActions}
          listTitle={listTitle}
          onRename={(title) => onRename(title)}
          onDelete={onDelete}
          onClose={closeListActions}
        />
      </div>
    </li>
  );
}
function ListAction({ isOpen, reference, listTitle, onRename, onDelete, onClose }) {
  function handleRename() {
    function saveTitle() {
      listTitle.current.setAttribute('contenteditable', false);
      onRename(listTitle.current.innerText);
    }
    listTitle.current.setAttribute('contenteditable', true);
    listTitle.current.focus();
    onClose();
    listTitle.current.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveTitle();
      }
    });
    listTitle.current.addEventListener('blur', () => saveTitle());
  }

  return (
    <ul
      className={
        'absolute right-0 top-full  z-10  w-max space-y-3 rounded-lg bg-background-primary p-3 shadow-md ' +
        (isOpen ? 'block' : 'hidden')
      }
      ref={reference}
    >
      <li
        className='grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-text-secondary transition-colors duration-300 hover:text-text-tertiary'
        onClick={handleRename}
      >
        <i className='fa-solid fa-pen '></i>
        <p>Rename List</p>
      </li>
      <li
        className='grid cursor-pointer grid-cols-[15px_1fr] items-center gap-2 text-start text-text-secondary transition-colors duration-300 hover:text-text-tertiary'
        onClick={onDelete}
      >
        <i className='fa-solid fa-trash '></i>
        <p>Delete List</p>
      </li>
    </ul>
  );
}
function AddNewList({ reference, onAdd, isOpen, lists, onDuplicate }) {
  const [value, setValue] = useState('');
  const [color, setColor] = useState('#ff6b6b');
  const inputEl = useRef(null);
  const colorsDiv = useRef(null);
  const untitledTasksNumber = useRef(0);

  useEffect(() => {
    inputEl.current.focus();
    function handleClick(e) {
      if (isOpen && e.target.tagName === 'SPAN') {
        const color = e.target.classList[4].split('[')[1].slice(0, 7);
        setColor(color);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen]);
  useEffect(() => {
    function handleKeyDown(e) {
      e.key === 'Enter' && isOpen && e.target.tagName !== 'INPUT' && handleAdd();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [value, color, isOpen]);

  function handleAdd() {
    const untitledNumber = value || untitledTasksNumber.current++;
    const title = value ? value : `Untitled ${untitledNumber > 0 ? untitledNumber : ''}`;
    onDuplicate(lists.find((list) => list.title?.toLowerCase() === title?.toLowerCase()) || {});
    if (lists.find((list) => list.title?.toLowerCase() === title?.toLowerCase())) return;
    onAdd(title, color);
    setValue('');
  }

  return (
    <div className='rounded-lg  border-2 border-background-tertiary p-3' ref={reference}>
      <div className='flex items-center gap-2 rounded-lg border border-background-tertiary px-2'>
        <span className='h-4 w-4 rounded-[3px]' style={{ backgroundColor: color }}></span>
        <form
          className='flex-1'
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <input
            type='text'
            className='w-full rounded-lg bg-transparent p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none'
            placeholder='List Name'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={inputEl}
          />
        </form>
      </div>
      <div className='mt-3 flex items-center justify-between gap-2' ref={colorsDiv}>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-1'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-2'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-3'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-4'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-5'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-6'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-7'></span>
        <span className='h-4 w-4 cursor-pointer rounded-[3px] bg-custom-8'></span>
      </div>
    </div>
  );
}
