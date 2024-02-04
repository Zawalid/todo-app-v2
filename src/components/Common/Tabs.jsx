export function Tabs({ tabs, currentTab, setCurrentTab, className = 'gap-8 sm:gap-12' }) {
  return (
    <div className={`flex items-center  border-b-2 border-border pb-2 ${className}`}>
      {tabs.map((tab) => {
        const tabTitle = tab.includes(' ')
          ? tab.split(' ')[0].toLowerCase() + tab.split(' ')[1]
          : tab.toLowerCase();
        return (
          <button
            key={tab}
            className={
              'before: relative text-sm font-semibold text-text-secondary before:absolute before:-bottom-[10px] before:left-0 before:h-[2px] before:w-full before:transition-colors before:duration-200  hover:before:bg-text-secondary sm:text-base ' +
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
