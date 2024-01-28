export default function Switch({ id, checked, onChange }) {
  return (
    <label className='relative inline-flex cursor-pointer items-center'>
      <input
        id={id}
        type='checkbox'
        className='peer sr-only'
        checked={checked}
        onChange={onChange}
      />
      <div className="peer h-5 w-9 rounded-full bg-background-tertiary after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full   after:bg-white    after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full  peer-focus:outline-none rtl:peer-checked:after:-translate-x-full "></div>
    </label>
  );
}
