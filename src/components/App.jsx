import { useEffect, useState } from 'react';
import { useLocalStorageState } from '../useLocalStorageState';
import { TaskInfo } from './Task Info/TaskInfo';
import { Menu } from './Menu/Menu';
import { Main } from './Main/Main';
import '../styles/App.css';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../Utils';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
  const [tasks, setTasks] = useLocalStorageState('tasks', [
    {
      id: Math.random(),
      title: 'Consult accountant',
      note: '',
      dueDate: '',
      listId: 'none',
      subtasks: [],
      isCompleted: true,
      tagsIds: [],
    },
  ]);
  const [currentTask, setCurrentTask] = useState(null);
  const [lists, setLists] = useLocalStorageState('lists', [
    {
      id: Math.random(),
      title: 'Personal',
      color: '#ff6b6b',
      tasks: [],
      number: 0,
    },
    {
      id: Math.random(),
      title: 'Work',
      color: '#66d9e8',
      tasks: [],
      number: 0,
    },
  ]);
  const [tags, setTags] = useLocalStorageState('tags', [
    {
      id: Math.random(),
      title: 'Tag 1',
      bgColor: '#d1eaed',
      textColor: '#444',
    },
  ]);
  const [stickyNotes, setStickyNotes] = useLocalStorageState('stickyNotes', [
    {
      id: Math.random(),
      title: 'Social Media',
      content: '- Plan social content - Build content calendar - Plan promotion and distribution',
      note: 'Social Media',
      bgColor: '#fdf2b3',
      textColor: '#444',
      creationDate: new Date().toLocaleDateString(),
    },
    {
      id: Math.random(),
      title: 'Content Strategy',
      content:
        'Would need time to get insights (goals, personals, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling.',
      description: 'Content Strategy',
      bgColor: '#d1eaed',
      textColor: '#444',
      creationDate: new Date().toLocaleDateString(),
    },
  ]);
  const [activeTab, setActiveTab] = useState('today');

  const todayTasks = tasks?.filter((task) => checkIfToday(task.dueDate));
  const tomorrowTasks = tasks?.filter((task) => checkIfTomorrow(task.dueDate));

  
  const thisWeekTasks = tasks?.filter((task) => {
    if (!task.dueDate) return;
    return isDateInCurrentWeek(task.dueDate);
  });
  const upcomingTasksNumber = todayTasks.length + tomorrowTasks.length + thisWeekTasks.length;
  useEffect(() => {
    isTaskInfoOpen || setCurrentTask(null);
  }, [isTaskInfoOpen]);

  function handlerAddTask(title, dueDate, listId) {
    const newTask = {
      id: Math.random(),
      title,
      note: '',
      dueDate: dueDate || '',
      listId: listId || 'none',
      subtasks: [],
      isCompleted: false,
      tagsIds: [],
    };
    setTasks((prev) => [...prev, newTask]);

    if (listId) handleAddTasksToList(listId, newTask);
  }
  function handleOpenTask(task) {
    setCurrentTask(task);
    setIsTaskInfoOpen(true);
  }
  function handleEditTask(task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    setIsTaskInfoOpen(false);
  }
  function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const newLists = lists.map((list) => {
      const tasks = list.tasks.filter((t) => t.id !== id);
      return { ...list, tasks };
    });
    setLists(newLists);
    setIsTaskInfoOpen(false);
  }
  function handleCompleteTask(id, isCompleted) {
    const newTasks = tasks.map((task) => (task.id === id ? { ...task, isCompleted } : task));
    setTasks(newTasks);
  }
  function handleAddList(title, color) {
    const newList = {
      id: Math.random(),
      title,
      color,
      tasks: [],
      number: 0,
    };
    setLists((prev) => [...prev, newList]);
  }
  function handleAddTasksToList(listId, task) {
    const newLists = lists
      .map((list) => {
        const tasks = list.tasks.filter((t) => t.id !== task.id);
        return { ...list, tasks };
      })
      .map((list) => {
        return list.id === +listId ? { ...list, tasks: [...list.tasks, task] } : list;
      });
    setLists(newLists);
  }
  function handleUpdateList(id, property, value) {
    const newLists = lists.map((list) => (list.id === id ? { ...list, [property]: value } : list));
    setLists(newLists);
  }
  function handleRenameList(id, title) {
    handleUpdateList(id, 'title', title);
  }
  function handleDeleteList(id) {
    const newLists = lists.filter((list) => list.id !== id);
    setLists(newLists);
    setActiveTab('upcoming');
  }
  function handleChangeListColor(id, color) {
    handleUpdateList(id, 'color', color);
  }
  function handleDuplicateLists(id) {
    const listToDuplicate = lists.find((list) => list.id === id);
    listToDuplicate.number++;
    const newListId = Math.random();
    const newListTasks = listToDuplicate.tasks.map((task) => {
      return {
        ...task,
        id: Math.random(),
        listId: newListId,
      };
    });
    const duplicatedList = {
      ...listToDuplicate,
      id: newListId,
      title: `${listToDuplicate.title}   (${listToDuplicate.number})`,
      tasks: newListTasks,
      number: 0,
    };
    setLists((prev) => [...prev, duplicatedList]);
    setTasks((prev) => {
      const newTasks = new Map(prev);
      newListTasks.forEach((task) => {
        const periodTasks = newTasks.get(task.period);
        newTasks.set(task.period, [...periodTasks, task]);
      });
      return newTasks;
    });
  }
  function handleAddTag(title, bgColor, textColor) {
    const newTag = {
      id: Math.random(),
      title,
      bgColor,
      textColor,
    };
    setTags((prev) => [...prev, newTag]);
  }
  function handleDeleteTag(id) {
    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
  }
  function handleAddStickyNote(note) {
    setStickyNotes((prev) => [...prev, note]);
  }
  function handleUpdateStickyNote(note) {
    const newNotes = stickyNotes.map((n) => (n.id === note.id ? note : n));
    setStickyNotes(newNotes);
  }
  function handleDeleteStickyNote(id) {
    const newNotes = stickyNotes.filter((n) => n.id !== id);
    setStickyNotes(newNotes);
  }
  function handleChangeTab(tab) {
    setActiveTab(tab);
    setIsTaskInfoOpen(false);
  }

  return (
    <div className='flex h-full gap-2 bg-background-primary p-5'>
      <Menu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        lists={lists}
        onAddList={handleAddList}
        todayTasksNumber={todayTasks.length}
        upcomingTasksNumber={upcomingTasksNumber}
        stickyNotesNumber={stickyNotes.length}
        onRenameList={handleRenameList}
        onDeleteList={handleDeleteList}
        onChangeListColor={handleChangeListColor}
        onDuplicateList={handleDuplicateLists}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        onChangeTab={handleChangeTab}
      />
      <Main
        tasks={tasks}
        onAddTask={handlerAddTask}
        onOpen={handleOpenTask}
        todayTasks={todayTasks}
        tomorrowTasks={tomorrowTasks}
        thisWeekTasks={thisWeekTasks}
        upcomingTasksNumber={upcomingTasksNumber}
        onComplete={handleCompleteTask}
        lists={lists}
        tags={tags}
        stickyNotes={stickyNotes}
        onAddNote={handleAddStickyNote}
        onUpdateNote={handleUpdateStickyNote}
        onDeleteNote={handleDeleteStickyNote}
        activeTab={activeTab}
      />
      <TaskInfo
        isOpen={isTaskInfoOpen}
        onClose={() => setIsTaskInfoOpen(false)}
        task={currentTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        lists={lists}
        onSelectList={handleAddTasksToList}
        tags={tags}
      />
    </div>
  );
}
