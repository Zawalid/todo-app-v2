export function Tabs({ tabs, currentTab, setCurrentTab }) {
  return (
    <div className='flex items-center  gap-12 border-b-2 pb-2'>
      {tabs.map((tab) => {
        const tabTitle = tab.includes(' ')
          ? tab.split(' ')[0].toLowerCase() + tab.split(' ')[1]
          : tab.toLowerCase();
        return (
          <button
            key={tab}
            className={
              'relative font-semibold text-text-secondary before:absolute before:-bottom-[10px] before:left-0 before:h-[2px] before:w-full before:transition-colors before:duration-300 hover:before:bg-text-secondary ' +
              (currentTab === tabTitle ? 'before:bg-text-secondary' : 'before:bg-text-transparent')
            }
            onClick={() => setCurrentTab(tabTitle)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
