import { useEffect, useRef, useState } from "react";
import "../App.css";
import { AddTask } from "./AddTask";
import { useLocalStorageState } from "../useLocalStorageState";
import { BigTitle } from "./Upcoming";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTaskInfoOpen, setIsTaskInfoOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useLocalStorageState("todayTasks", [
    {
      id: Math.random(),
      title: "Consult accountant",
      description: "",
      dueDate: "",
      list: "List 1",
      subtasks: [],
      isCompleted: true,
    },
  ]);
  const [currentTask, setCurrentTask] = useState(null);

  function handlerAddTask(title) {
    const newTask = {
      id: Math.random(),
      title,
      description: "",
      dueDate: "",
      list: "",
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
    setIsTaskInfoOpen(false);
  }
  function handleCompleteTask(id, isCompleted) {
    const newTasks = todayTasks.map((task) =>
      task.id === id ? { ...task, isCompleted } : task,
    );
    setTodayTasks(newTasks);
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
          onComplete={handleCompleteTask}
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
      {isOpen || (
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
  const [taskTitle, setTaskTitle] = useState();
  const [taskDescription, setTaskDescription] = useState();
  const [taskList, setTaskList] = useState();
  const [taskDueDate, setTaskDueDate] = useState();
  const [taskSubtasks, setTaskSubtasks] = useState();
  const [isChanged, setIsChanged] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      setTaskTitle(task?.title);
      setTaskDescription(task?.description);
      setTaskList(task?.list);
      setTaskDueDate(task?.dueDate);
      setTaskSubtasks(task?.subtasks);
    } else {
      setTaskTitle("");
      setTaskDescription("");
      setTaskList("");
      setTaskDueDate("");
      setTaskSubtasks([]);
    }
  }, [task, isOpen]);
  useEffect(() => {
    if (isOpen)
      task?.title !== taskTitle ||
      task?.description !== taskDescription ||
      task?.list !== taskList ||
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
  }, [
    isOpen,
    task,
    taskTitle,
    taskDescription,
    taskList,
    taskDueDate,
    taskSubtasks,
  ]);

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
        list: taskList,
        dueDate: taskDueDate,
        subtasks: taskSubtasks,
      };
      onEdit(editedTask);
    }
  }
  function handleEditSubtask(id, title) {
    const newSubtasks = taskSubtasks
      .map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask))
      .filter((subtask) => subtask.title !== "");
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
              className="w-full rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Task Title"
              value={taskTitle || ""}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <textarea
              className="mt-2 h-32 w-full resize-none  rounded-lg  border  border-background-tertiary bg-transparent p-2 text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none"
              placeholder="Description"
              value={taskDescription || ""}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="grid grid-cols-[1fr_3fr] items-center space-y-2">
            <label className="text-sm text-text-tertiary">List</label>
            <select className="w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none">
              <option>Personal</option>
            </select>
            <label className="text-sm text-text-tertiary">Due date</label>
            <input
              type="date"
              className="w-fit rounded-lg border border-background-tertiary  bg-transparent  p-2  text-sm text-text-secondary  focus:outline-none"
              min={today}
              value={taskDueDate || ""}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <label className="text-sm text-text-tertiary">Tags</label>
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
              <AddTask onAdd={handleAddSubTask} />
            </div>
            <ul className="mt-3 space-y-2 px-3">
              {taskSubtasks?.map((subtask) => (
                <SubTask
                  key={subtask.id}
                  title={subtask.title}
                  onDelete={() => handleDeleteSubtask(subtask.id)}
                  onEdit={(title) => handleEditSubtask(subtask.id, title)}
                  isCompleted={subtask.isCompleted}
                  onComplete={(isCompleted) =>
                    handleCompleteSubTask(subtask.id, isCompleted)
                  }
                />
              ))}
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
export function Today({ todayTasks, onAdd, onOpen, onComplete }) {
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
              subtasksNumber={task.subtasks.length}
              list={task.list}
              onOpen={() => onOpen(task)}
              isCompleted={task.isCompleted}
              onComplete={(isCompleted) => onComplete(task.id, isCompleted)}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
function Task({
  title,
  dueDate,
  subtasksNumber,
  list,
  onOpen,
  isCompleted,
  onComplete,
}) {
  const [checked, setChecked] = useState(isCompleted);
  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  return (
    <li
      className={
        "flex items-center justify-between  gap-3 rounded-lg border-b  border-background-tertiary px-5 py-2 transition-colors duration-500 " +
        (checked ? "bg-background-secondary" : "")
      }
    >
      <div className="relative">
        <input
          type="checkbox"
          className="task peer"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <i className="fas fa-check pointer-events-none  absolute left-1  top-1 hidden h-4 w-4 text-sm text-white peer-checked:block"></i>
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
function SubTask({ title, onEdit, onDelete, isCompleted, onComplete }) {
  const [checked, setChecked] = useState(isCompleted);
  const subTaskEl = useRef(null);

  useEffect(() => {
    onComplete(checked);
    // eslint-disable-next-line
  }, [checked]);

  function editSubTask() {
    function saveTitle() {
      subTaskEl.current.setAttribute("contenteditable", false);
      onEdit(subTaskEl.current.innerText);
    }
    subTaskEl.current.setAttribute("contenteditable", true);
    subTaskEl.current.focus();
    subTaskEl.current.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveTitle();
      }
    });
    subTaskEl.current.addEventListener("blur", () => saveTitle());
  }
  return (
    <li className="flex items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          className="subtask peer"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <i className="fas fa-check pointer-events-none  absolute left-[2px]  top-[2px] hidden h-4 w-4 text-sm text-white peer-checked:block"></i>
      </div>
      <p
        className={
          "border-1 flex-1 text-sm font-medium text-text-secondary  focus:border-background-tertiary focus:outline-none " +
          (checked ? "line-through" : "")
        }
        ref={subTaskEl}
      >
        {title}
      </p>
      <div className="flex items-center gap-2">
        <button onClick={editSubTask}>
          <i className="fas fa-pen cursor-pointer text-xs text-text-tertiary"></i>
        </button>
        <button onClick={onDelete}>
          <i className="fas fa-trash cursor-pointer text-xs text-text-tertiary"></i>
        </button>
      </div>
    </li>
  );
}
