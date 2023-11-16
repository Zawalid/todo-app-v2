
export function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      className='focus-border-none w-full rounded-md border bg-background-secondary p-2 text-text-secondary placeholder-text-tertiary focus:outline-none '
      placeholder={placeholder}
      value={value}
      onChange={onChange} />
  );
}
