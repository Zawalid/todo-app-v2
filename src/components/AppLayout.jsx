import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { TaskInfo } from './Task Info/TaskInfo';
import { Menu } from './Menu/Menu';
import { Main } from './Main/Main';
import '../styles/App.css';
import { SearchProvider } from '../contexts/Search';

export default function AppLayout() {
  const [trash, setTrash] = useLocalStorageState('trash', {
    tasks: [],
    lists: [],
    tags: [],
    notes: [],
  });

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

  // function handleDeleteList(id) {
  //   const newLists = lists.filter((list) => list.id !== id);
  //   setLists(newLists);
  //   setTrash((prev) => ({ ...prev, lists: [...prev.lists, lists.find((list) => list.id === id)] }));
  // }

  // function handleDuplicateLists(id) {
  //   const listToDuplicate = lists.find((list) => list.id === id);
  //   listToDuplicate.number++;
  //   const newListId = Math.random();
  //   const newListTasks = listToDuplicate.tasks.map((task) => {
  //     return {
  //       ...task,
  //       id: Math.random(),
  //       listId: newListId,
  //       index: tasks.length,
  //     };
  //   });
  //   const duplicatedList = {
  //     ...listToDuplicate,
  //     id: newListId,
  //     title: `${listToDuplicate.title}   (${listToDuplicate.number})`,
  //     tasks: newListTasks,
  //     number: 0,
  //     index: lists.length,
  //   };
  //   setLists((prev) => [...prev, duplicatedList]);
  //   // setTasks((prev) => [...prev, ...newListTasks]);
  // }

  // function handleDeleteTag(id) {
  //   const newTags = tags.filter((tag) => tag.id !== id);
  //   setTags(newTags);
  //   setTrash((prev) => ({ ...prev, tags: [...prev.tags, tags.find((tag) => tag.id === id)] }));
  // }

  // function handleDeleteStickyNote(id) {
  //   const newNotes = stickyNotes.filter((n) => n.id !== id);
  //   setStickyNotes(newNotes);
  //   setTrash((prev) => ({
  //     ...prev,
  //     notes: [...prev.notes, stickyNotes.find((note) => note.id === id)],
  //   }));
  // }
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
      // setTasks((prev) => restoreItem(prev, item, index));
      // handleAddTaskToList(item.listId, item);
    }
    if (type === 'lists') {
      // setLists((prev) => restoreItem(prev, item, index));
    }
    if (type === 'tags') {
      // setTags((prev) => restoreItem(prev, item, index));
    }
    if (type === 'notes') {
      // setStickyNotes((prev) => restoreItem(prev, item, index));
    }
  }

  return (
    <div className='flex h-full gap-2 bg-background-primary p-5'>
      <SearchProvider>
        <Menu
          trash={trash}
          onDeleteFromTrash={handleDeleteFromTrash}
          onEmptyTypeFromTrash={handleEmptyTypeFromTrash}
          onEmptyTrash={handleEmptyTrash}
          onRestoreFromTrash={handleRestoreFromTrash}
        />
        <Main />
      </SearchProvider>
      <TaskInfo />
    </div>
  );
}
