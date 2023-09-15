import { useEffect, useState } from "react";
import "../App.css";
import { AddTask } from "./AddTask";
import { useLocalStorageState } from "../useLocalStorageState";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useLocalStorageState("todayTasks", [
    {
      id: Math.random(),
      title: "Research content ideas",
      description: "",
      dueDate: "",
      subtasksNumber: 0,
      list: "",
    },
    {
      id: Math.random(),
      title: "Create a database of guest authors",
      description: "",
      dueDate: "",
      subtasksNumber: 0,
      list: "",
    },
    {
      id: Math.random(),
      title: "Renew driver's license",
      description: "",
      dueDate: "2023-09-13",
      subtasksNumber: 1,
      list: "Personal",
    },
    {
      id: Math.random(),
      title: "Consult accountant",
      description: "",
      dueDate: "",
      list: "List 1",
      subtasksNumber: 3,
    },
    {
      id: Math.random(),
      title: "Print business cards",
      description: "",
      dueDate: "",
      subtasksNumber: 0,
      list: "",
    },
  ]);
  const [currentTask, setCurrentTask] = useState(null);

  function handlerAddTask(title) {
    const newTask = {
      id: Math.random(),
      title,
      description: "",
      dueDate: "",
      subtasksNumber: 0,
      list: "",
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
    setIsTaskInfoOpen(false);
  }

  return (
    <div className="flex h-full gap-2 bg-background-primary p-5">
      <Menu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <Main>
        <BigTitle title="Today" count={todayTasks.length} />
        <Today
          todayTasks={todayTasks}
          onAdd={handlerAddTask}
          onOpen={handleOpenTask}
        />
      </Main>
      <TaskInfo
        isOpen={isTaskInfoOpen}
        onClose={() => setIsTaskInfoOpen(false)}
        task={currentTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

function Menu({ isOpen, setIsOpen }) {
  return (
    <aside
      className={
        "flex flex-col overflow-y-auto rounded-xl  p-4  transition-[width]  duration-500   " +
        (isOpen
          ? "w-[22%] items-stretch bg-background-secondary "
          : "w-0 items-center bg-background-primary  ")
      }
    >
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-bars cursor-pointer text-text-secondary"></i>
        </button>
      )}
      {isOpen && (
        <>
          <div className="flex  items-center justify-between">
            <h2 className="text-xl font-bold text-text-secondary">Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-xmark cursor-pointer text-xl text-text-secondary"></i>
            </button>
          </div>
          <div className="relative my-5 w-full">
            <i className="fas fa-search absolute left-3 top-[5px] text-sm text-text-tertiary"></i>
            <input
              type="text"
              className="w-full rounded-lg border border-background-tertiary  bg-transparent  py-1 pl-10  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Search"
            />
          </div>
          <div className="pb-5">
            <h4 className="mb-4 mt-5  font-medium text-text-secondary">
              Tasks
            </h4>
            <ul className="space-y-1">
              <li className="menu_task_element active group">
                <i className="fas fa-angles-right text-text-tertiary"></i>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold">
                  Upcoming
                </span>
                <div className="grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary">
                  <span className="text-xs font-semibold text-text-secondary">
                    12
                  </span>
                </div>
              </li>
              <li className="menu_task_element group">
                <i className="fas fa-list-check text-text-tertiary"></i>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold">
                  Today
                </span>
                <div className="grid place-content-center rounded-sm bg-background-tertiary py-[1px] transition-colors duration-300  group-hover:bg-background-primary">
                  <span className="text-xs font-semibold text-text-secondary">
                    5
                  </span>
                </div>
              </li>
              <li className="menu_task_element group">
                <i className="fas fa-note-sticky text-text-tertiary"></i>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 group-hover:font-bold">
                  Sticky Wall
                </span>
              </li>
            </ul>
          </div>
          <div className="border-y border-background-tertiary pb-5">
            <h4 className="mb-4 mt-5  font-medium text-text-secondary">
              Lists
            </h4>
            <ul className="space-y-1">
              <li className="menu_element ">
                <div className="h-5 w-5 rounded-md bg-[#ff6b6b]"></div>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 ">
                  Personal
                </span>
                <div className="grid place-content-center rounded-sm bg-background-tertiary py-[1px]">
                  <span className="text-xs font-semibold text-text-secondary">
                    3
                  </span>
                </div>
              </li>
              <li className="menu_element">
                <div className="h-5 w-5 rounded-md bg-[#66d9e8]"></div>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 ">
                  Work
                </span>
                <div className="grid place-content-center rounded-sm bg-background-tertiary py-[1px]">
                  <span className="text-xs font-semibold text-text-secondary">
                    6
                  </span>
                </div>
              </li>
              <li className="menu_element">
                <div className="h-5 w-5 rounded-md bg-[#ffd43b]"></div>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 ">
                  List 1
                </span>
                <div className="grid place-content-center rounded-sm bg-background-tertiary py-[1px]">
                  <span className="text-xs font-semibold text-text-secondary">
                    6
                  </span>
                </div>
              </li>
              <li className="grid cursor-pointer grid-cols-[35px_auto] px-3 py-2">
                <i className="fas fa-plus text-text-tertiary"></i>
                <span className="text-sm text-text-secondary transition-[font-weight] duration-100 ">
                  Add New List
                </span>
              </li>
            </ul>
          </div>
          <div className="mb-16">
            <h4 className="mb-4 mt-5 font-medium text-text-secondary">Tags</h4>
            <ul className="flex flex-wrap gap-2">
              <li className="menu_tag_element bg-[#d1eaed]">Tag 1</li>
              <li className="menu_tag_element bg-[#ffdada]">Tag 2</li>
              <li className="menu_tag_element bg-background-tertiary">
                + Add Tag
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <ul className="space-y-3">
              <li className="grid cursor-pointer grid-cols-[25px_auto] items-center">
                <i className="fa-solid fa-sliders text-text-tertiary"></i>
                <span className="text-text-secondary">Settings</span>
              </li>
              <li className="grid cursor-pointer grid-cols-[25px_auto] items-center">
                <i className="fa-solid fa-right-from-bracket text-text-tertiary"></i>
                <span className="text-text-secondary">Log Out</span>
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
    <main className="flex flex-1 flex-col overflow-y-auto rounded-xl bg-background-primary px-5 ">
      {children}
    </main>
  );
}
function TaskInfo({ isOpen, onClose, task, onEdit, onDelete }) {
  const [taskTitle, setTaskTitle] = useState(task?.title);
  const [taskDescription, setTaskDescription] = useState(task?.description);
  const [taskList, setTaskList] = useState(task?.list);
  const [taskDueDate, setTaskDueDate] = useState(task?.dueDate);
  const [isChanged, setIsChanged] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setTaskTitle(task?.title);
    setTaskDescription(task?.description);
    setTaskList(task?.list);
    setTaskDueDate(task?.dueDate);
  }, [task]);

  useEffect(() => {
    if (
      task?.title !== taskTitle ||
      task?.description !== taskDescription ||
      task?.list !== taskList ||
      task?.dueDate !== taskDueDate
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [taskTitle, taskDescription, taskList, taskDueDate, task]);

  return (
    <aside
      className={
        "ml-auto flex flex-col overflow-y-auto rounded-xl transition-[width] duration-500 " +
        (isOpen
          ? "w-[30%] items-stretch bg-background-secondary  p-4"
          : "w-0 items-center bg-background-primary p-0")
      }
    >
      {isOpen && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-secondary">Task:</h2>
            <button onClick={onClose}>
              <i className="fa-solid fa-xmark cursor-pointer text-xl text-text-secondary"></i>
            </button>
          </div>
          <div className="my-5">
            <input
              type="text"
              className="w-full rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Task Title"
              value={taskTitle || ""}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <textarea
              className="mt-2 h-32 w-full resize-none  rounded-lg  border  border-background-tertiary bg-transparent p-2 text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Description"
              value={taskDescription || ""}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="grid grid-cols-[1fr_3fr] items-center space-y-2">
            <label className="text-sm text-text-secondary">List</label>
            <select className="w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none">
              <option>Personal</option>
            </select>
            <label className="text-sm text-text-secondary">Due date</label>
            <input
              type="date"
              className="w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
              min={today}
              value={taskDueDate || ""}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <label className="text-sm text-text-secondary">Tags</label>
            <ul className="flex flex-wrap gap-2">
              <li className="menu_tag_element bg-[#d1eaed]">Tag 1</li>
              <li className="menu_tag_element bg-background-tertiary">
                + Add Tag
              </li>
            </ul>
          </div>
          <div className="my-7 min-h-[300px] flex-shrink-0 overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold text-text-secondary">
              Subtasks:
            </h2>
            <div className="flex items-center gap-3 border-b border-background-tertiary px-3 py-1">
              <i className="fa-solid fa-plus text-xl text-text-tertiary"></i>
              <input
                type="text"
                className="w-full rounded-lg bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
                placeholder="Add New Task"
              />
            </div>
            <ul className="mt-3 space-y-2 px-3">
              <li className="flex items-center gap-3">
                <div className="relative">
                  <input type="checkbox" id="some_id" className=" peer " />
                  <i className="fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block"></i>
                </div>
                <span className=" text-sm font-medium text-text-secondary">
                  Subtask
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-auto flex gap-3">
            <button
              className="flex-1 cursor-pointer rounded-lg border border-background-tertiary bg-red-500 py-2 text-center text-sm font-semibold text-background-secondary"
              onClick={() => onDelete(task.id)}
            >
              Delete Task
            </button>
            <button
              className={
                "flex-1 rounded-lg border border-background-tertiary py-2 text-center  text-sm font-semibold transition-colors duration-500 " +
                (isChanged
                  ? "cursor-pointer bg-indigo-400 text-background-secondary "
                  : "cursor-not-allowed bg-background-tertiary text-text-tertiary")
              }
              onClick={() => {
                if (isChanged) {
                  const editedTask = {
                    ...task,
                    title: taskTitle,
                    description: taskDescription,
                    list: taskList,
                    dueDate: taskDueDate,
                  };
                  onEdit(editedTask);
                }
              }}
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
function BigTitle({ title, count }) {
  return (
    <div className="mb-10 flex items-center gap-8">
      <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
      {count && (
        <span className="rounded-lg border border-background-tertiary px-3 py-2 text-3xl font-semibold">
          {count}
        </span>
      )}
    </div>
  );
}
export function SmallTitle({ title }) {
  return <h1 className="mb-3 text-2xl font-bold text-text-primary">{title}</h1>;
}
export function Today({ todayTasks, onAdd, onOpen }) {
  return (
    <>
      <div>
        <div className="flex items-center gap-3 rounded-xl border border-background-tertiary px-5 py-1">
          <i className="fa-solid fa-plus text-xl text-text-tertiary"></i>
          <AddTask onAdd={onAdd} />
        </div>
        <ul className="mt-3 space-y-2">
          {todayTasks.map((task) => (
            <Task
              key={task.id}
              title={task.title}
              dueDate={task.dueDate}
              subtasksNumber={task.subtasksNumber}
              list={task.list}
              onOpen={() => onOpen(task)}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

function Task({ title, dueDate, subtasksNumber, list, onOpen }) {
  return (
    <li className="flex items-center justify-between  gap-3 border-b border-background-tertiary px-5 pb-2">
      <div className="relative">
        <input type="checkbox" id="some_id" className=" peer " />
        <i className="fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block"></i>
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-text-secondary">{title}</span>
        <div className="mt-2 flex flex-wrap items-center gap-5">
          {dueDate && (
            <div className="flex items-center gap-2">
              <i className="fas fa-calendar-alt text-text-tertiary"></i>
              <span className="text-xs font-semibold text-text-secondary">
                {dueDate}
              </span>
            </div>
          )}
          {subtasksNumber > 0 && (
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-background-tertiary px-3 py-[1px] text-xs font-semibold text-text-secondary">
                {subtasksNumber}
              </span>
              <span className="text-xs font-semibold text-text-secondary">
                Subtasks
              </span>
            </div>
          )}
          {list && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-sm bg-[#ff6b6b]"></div>
              <span className="text-xs font-semibold text-text-secondary">
                {list}
              </span>
            </div>
          )}
        </div>
      </div>
      <button onClick={onOpen}>
        <i className="fa-solid fa-chevron-right cursor-pointer text-text-tertiary"></i>
      </button>
    </li>
  );
}
