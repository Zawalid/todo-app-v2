export function Tag({ title, bgColor, textColor, onDeleteTag, showDeleteButton, id, customClassName }) {
  return (
    <li
      className={'menu_tag_element relative ' + customClassName}
      style={{ backgroundColor: bgColor, color: textColor }}
      data-id={id}
    >
      {showDeleteButton && (
        <button
          className='absolute -right-1 -top-1 grid h-3 w-3 cursor-pointer place-content-center rounded-full bg-red-600'
          onClick={onDeleteTag}
        >
          <i className='fas fa-xmark  text-[10px] text-white'></i>
        </button>
      )}
      {title}
    </li>
  );
}
