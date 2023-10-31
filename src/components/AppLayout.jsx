import { useEffect, useState } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { TaskInfo } from './Task Info/TaskInfo';
import { Menu } from './Menu/Menu';
import { Main } from './Main/Main';
import '../styles/App.css';
import { checkIfToday, checkIfTomorrow, isDateInCurrentWeek } from '../Utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTasks } from '../contexts/Tasks';

export default function AppLayout({ lists, setLists }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  // const [tasks, setTasks] = useLocalStorageState('tasks', [
  //   {
  //     id: Math.random(),
  //     title: 'Consult accountant',
  //     note: '',
  //     dueDate: '',
  //     listId: 'none',
  //     subtasks: [],
  //     isCompleted: true,
  //     tagsIds: [],
  //     priority: 0,
  //     createdAt: new Date(),
  //     index: 0,
  //   },
  // ]);
  const {
    tasks,
    handlerAddTask,
    handleEditTask,
    handleDeleteTask,
    handleCompleteTask,
    handleClearAllTasks,
    handleOpenTask,
  } = useTasks();

  const [tags, setTags] = useLocalStorageState('tags', [
    {
      id: Math.random(),
      title: 'Tag 1',
      bgColor: '#d1eaed',
      textColor: '#444',
      index: 0,
    },
  ]);
  const [stickyNotes, setStickyNotes] = useLocalStorageState('stickyNotes', [
    {
      id: Math.random(),
      title: 'Social Media',
      content: '- Plan social content - Build content calendar - Plan promotion and distribution',
      description: 'Social Media',
      bgColor: '#fdf2b3',
      textColor: '#444',
      creationDate: new Date().toLocaleDateString(),
      index: 0,
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
      index: 1,
    },
  ]);
  const [currentSearchTab, setCurrentSearchTab] = useState('all');
  const [trash, setTrash] = useLocalStorageState('trash', {
    tasks: [],
    lists: [],
    tags: [],
    notes: [],
  });
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query');
  const navigate = useNavigate();

  const todayTasks = tasks?.filter((task) => checkIfToday(task.dueDate));
  const tomorrowTasks = tasks?.filter((task) => checkIfTomorrow(task.dueDate));
  const thisWeekTasks = tasks?.filter((task) => {
    if (!task.dueDate) return;
    return isDateInCurrentWeek(task.dueDate);
  });
  const todayAndTomorrowTasks = [...todayTasks, ...tomorrowTasks];
  const thisWeekWithoutTodayAndTomorrowTasks = thisWeekTasks.filter(
    (t) => !todayAndTomorrowTasks.includes(t),
  );
  const upcomingTasksNumber =
    todayAndTomorrowTasks.length + thisWeekWithoutTodayAndTomorrowTasks.length;

  const searchSection =
    currentSearchTab === 'all'
      ? tasks
      : currentSearchTab === 'today'
      ? todayTasks
      : currentSearchTab === 'upcoming'
      ? [...todayAndTomorrowTasks, ...thisWeekWithoutTodayAndTomorrowTasks]
      : stickyNotes;

  const searchResults = searchSection.filter(
    (result) =>
      result.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      result[currentSearchTab === 'stickyWall' ? 'content' : 'note']
        ?.toLowerCase()
        .includes(searchQuery) ||
      result.description?.toLowerCase().includes(searchQuery),
  );


  // function handlerAddTask(title, dueDate, listId) {
  //   const newTask = {
  //     id: Math.random(),
  //     title,
  //     note: '',
  //     dueDate: dueDate || '',
  //     listId: listId || 'none',
  //     subtasks: [],
  //     isCompleted: false,
  //     tagsIds: [],
  //     priority: 0,
  //     createdAt: new Date(),
  //     index: tasks.length,
  //   };
  //   setTasks((prev) => [...prev, newTask]);

  //   if (listId) handleAddTasksToList(listId, newTask);
  // }
  // function handleOpenTask(task) {
  //   setCurrentTask(task);
  //   setIsTaskOpen(true);
  // }
  // function handleEditTask(task) {
  //   setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  //   setIsTaskOpen(false);
  // }
  // function handleDeleteTask(id) {
  //   setTasks((prev) => prev.filter((t) => t.id !== id));
  //   const newLists = lists.map((list) => {
  //     const tasks = list.tasks.filter((t) => t.id !== id);
  //     return { ...list, tasks };
  //   });
  //   setLists(newLists);
  //   setIsTaskOpen(false);
  //   setTrash((prev) => ({ ...prev, tasks: [...prev.tasks, currentTask] }));
  // }
  // function handleCompleteTask(id, isCompleted) {
  //   const newTasks = tasks.map((task) => (task.id === id ? { ...task, isCompleted } : task));
  //   setTasks(newTasks);
  // }
  // function handleClearAllTasks(condition1, condition2) {
  //   const filteredTasks = [];
  //   const deletedTasks = [];
  //   tasks.forEach((task) =>
  //     condition1(task) && condition2(task) ? deletedTasks.push(task) : filteredTasks.push(task),
  //   );
  //   setTasks(filteredTasks);
  //   setLists(
  //     lists.map((list) => {
  //       const listTasks = list.tasks.filter((task) =>
  //         filteredTasks.map((t) => t.id).includes(task.id),
  //       );
  //       return { ...list, tasks: listTasks };
  //     }),
  //   );
  //   setTrash((prev) => ({ ...prev, tasks: [...prev.tasks, ...deletedTasks] }));
  // }
  function handleAddList(title, color) {
    const newList = {
      id: Math.random(),
      title,
      color,
      tasks: [],
      number: 0,
      index: lists.length,
    };
    setLists((prev) => [...prev, newList]);
  }
  function handleAddTasksToList(listId, task) {
    if (!listId) return;
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
    setTrash((prev) => ({ ...prev, lists: [...prev.lists, lists.find((list) => list.id === id)] }));
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
        index: tasks.length,
      };
    });
    const duplicatedList = {
      ...listToDuplicate,
      id: newListId,
      title: `${listToDuplicate.title}   (${listToDuplicate.number})`,
      tasks: newListTasks,
      number: 0,
      index: lists.length,
    };
    setLists((prev) => [...prev, duplicatedList]);
    setTasks((prev) => [...prev, ...newListTasks]);
  }
  function handleAddTag(title, bgColor, textColor) {
    const newTag = {
      id: Math.random(),
      title,
      bgColor,
      textColor,
      index: tags.length,
    };
    setTags((prev) => [...prev, newTag]);
  }
  function handleDeleteTag(id) {
    const newTags = tags.filter((tag) => tag.id !== id);
    setTags(newTags);
    setTrash((prev) => ({ ...prev, tags: [...prev.tags, tags.find((tag) => tag.id === id)] }));
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
    setTrash((prev) => ({
      ...prev,
      notes: [...prev.notes, stickyNotes.find((note) => note.id === id)],
    }));
  }
  function handleDeleteFromTrash(id, type) {
    const newTrash = { ...trash };
    newTrash[type] = newTrash[type].filter((item) => item.id !== id);
    setTrash(newTrash);
  }
  function handleEmptyTypeFromTrash(type) {
    setTrash((prev) => ({ ...prev, [type]: [] }));
  }
  function handleEmptyTrash() {
    setTrash({
      tasks: [],
      lists: [],
      tags: [],
      notes: [],
    });
  }
  function handleRestoreFromTrash(id, index, type) {
    const item = trash[type].find((item) => item.id === id);
    setTrash((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
    const restoreItem = (prev, item, index) => {
      return [...prev.slice(0, index), item, ...prev.slice(index)];
    };

    if (type === 'tasks') {
      setTasks((prev) => restoreItem(prev, item, index));
      handleAddTasksToList(item.listId, item);
    }
    if (type === 'lists') {
      setLists((prev) => restoreItem(prev, item, index));
    }
    if (type === 'tags') {
      setTags((prev) => restoreItem(prev, item, index));
    }
    if (type === 'notes') {
      setStickyNotes((prev) => restoreItem(prev, item, index));
    }
  }
  function handleSearch(query) {
    query?.trim() === '' ? navigate('/all') : navigate(`/search?query=${query}`);
  }
  return (
    <div className='flex h-full gap-2 bg-background-primary p-5'>
      <Menu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        lists={lists}
        onAddList={handleAddList}
        allTasksNumber={tasks.length}
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
        searchQuery={searchQuery}
        onSearch={(query) => handleSearch(query)}
        trash={trash}
        onDeleteFromTrash={handleDeleteFromTrash}
        onEmptyTypeFromTrash={handleEmptyTypeFromTrash}
        onEmptyTrash={handleEmptyTrash}
        onRestoreFromTrash={handleRestoreFromTrash}
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
        onClearAllTasks={handleClearAllTasks}
        lists={lists}
        tags={tags}
        stickyNotes={stickyNotes}
        onAddNote={handleAddStickyNote}
        onUpdateNote={handleUpdateStickyNote}
        onDeleteNote={handleDeleteStickyNote}
        searchResults={searchResults}
        currentSearchTab={currentSearchTab}
        setCurrentSearchTab={setCurrentSearchTab}
      />
      <TaskInfo
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        lists={lists}
        onSelectList={handleAddTasksToList}
        tags={tags}
      />
    </div>
  );
}
