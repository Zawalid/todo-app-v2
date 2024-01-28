export function InputField({ type, placeholder, value, onChange, className }) {
  return (
    <input
      type={type}
      className={
        'focus-border-none w-full rounded-md border border-border bg-background-primary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none ' +
        className
      }
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
