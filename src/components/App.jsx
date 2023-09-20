import { useState } from 'react';
import '../App.css';
import { useLocalStorageState } from '../useLocalStorageState';
import { TaskInfo } from './Task Info/TaskInfo';
import { Menu } from './Menu/Menu';
import { Main } from './Main/Main';

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
  const [activeTab, setActiveTab] = useState('today');

  function handlerAddTask(title, listId) {
    const newTask = {
      id: Math.random(),
      title,
      description: '',
      dueDate: '',
      listId: listId || 'none',
      subtasks: [],
      isCompleted: false,
      tagsIds: [],
    };
    setTodayTasks((prev) => [...prev, newTask]);
    if (listId) handleAddTasksToList(listId, newTask);
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
    setTodayTasks((prev) => [...prev, ...newListTasks]);
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
        onChangeListColor={handleChangeListColor}
        onDuplicateList={handleDuplicateLists}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        onChangeTab={(tab) => setActiveTab(tab)}
      />
      <Main
        todayTasks={todayTasks}
        onAdd={handlerAddTask}
        onOpen={handleOpenTask}
        onComplete={handleCompleteTask}
        lists={lists}
        tags={tags}
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


