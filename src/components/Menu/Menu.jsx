import { useEffect, useRef } from 'react';
import { MenuLists } from './Menu Lists/MenuLists';
import { MenuTags } from './Menu Tags/MenuTags';
import { MenuTasks } from './Menu Tasks/MenuTasks';

// ------------------------------ Menu ------------------------------
export function Menu({
  isOpen, setIsOpen, todayTasksNumber, lists, onAddList, onRenameList, onDeleteList, onChangeListColor, onDuplicateList, tags, onAddTag, onDeleteTag, onChangeTab,
}) {
  const menu = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menu.current && e.target.closest('.menu_element')) {
        menu.current
          .querySelectorAll('.menu_element')
          .forEach((el) => el.classList.remove('active'));
        const currentTab = e.target.closest('.menu_element');
        currentTab.classList.add('active');
        onChangeTab(currentTab.dataset.tab);
      }
    }
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [menu]);

  return (
    <aside
      className={'flex flex-col overflow-y-auto rounded-l-xl  p-4  transition-[width]  duration-500   ' +
        (isOpen
          ? 'w-[22%] items-stretch bg-background-secondary '
          : 'w-0 items-center bg-background-primary  ')}
      ref={menu}
    >
      {isOpen || (
        <button onClick={() => setIsOpen(true)}>
          <i className='fa-solid fa-bars cursor-pointer text-text-secondary'></i>
        </button>
      )}
      {isOpen && (
        <>
          <div className='flex  items-center justify-between'>
            <h2 className='text-xl font-bold text-text-secondary'>Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-secondary'></i>
            </button>
          </div>
          <div className='relative my-5 w-full'>
            <i className='fas fa-search absolute left-3 top-[5px] text-sm text-text-tertiary'></i>
            <input
              type='text'
              className='w-full rounded-lg border border-background-tertiary  bg-transparent  py-1 pl-10  text-sm text-text-tertiary placeholder:text-text-tertiary focus:outline-none'
              placeholder='Search' />
          </div>
          <MenuTasks todayTasksNumber={todayTasksNumber} />
          <MenuLists
            lists={lists}
            onAddList={onAddList}
            onRenameList={onRenameList}
            onDeleteList={onDeleteList}
            onChangeListColor={onChangeListColor}
            onDuplicateList={onDuplicateList} />
          <MenuTags tags={tags} onAddTag={onAddTag} onDeleteTag={onDeleteTag} />
          <div className='mt-auto'>
            <ul className='space-y-3'>
              <li className='grid cursor-pointer grid-cols-[25px_auto] items-center'>
                <i className='fa-solid fa-sliders text-text-tertiary'></i>
                <span className='text-text-secondary'>Settings</span>
              </li>
              <li className='grid cursor-pointer grid-cols-[25px_auto] items-center'>
                <i className='fa-solid fa-right-from-bracket text-text-tertiary'></i>
                <span className='text-text-secondary'>Log Out</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </aside>
  );
}
