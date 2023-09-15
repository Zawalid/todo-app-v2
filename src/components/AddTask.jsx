import { useEffect, useRef, useState } from "react";

export function AddTask({ onAdd }) {
  const [value, setValue] = useState("");
  const inputEl = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName !== "TEXTAREA" &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "P" &&
        e.key === "Enter") {
        e.preventDefault();
        inputEl.current.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    onAdd(value);
    setValue("");
  };
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-full rounded-lg bg-transparent  p-2  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none"
        placeholder="Add New Task"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputEl} />
    </form>
  );
}
