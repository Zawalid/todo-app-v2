export function Settings({ onClose, settings, dispatch }) {
  return (
    <div className='fixed left-0 top-0  z-[99]  flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-[1px]'>
      <div className=' relative flex  w-1/2 flex-col rounded-lg bg-white p-4'>
        <div className='flex items-center justify-between pb-5'>
          <h2 className='text-2xl font-bold text-text-primary'>Settings</h2>
          <button onClick={onClose}>
            <i className='fa-solid fa-xmark cursor-pointer text-xl text-text-tertiary'></i>
          </button>
        </div>
        <div className='mt-3 flex flex-col gap-5'>
          <div>
            <label className='font-semibold  text-text-secondary '>Play completion sound</label>
            <ToggleSwitch
              checked={settings.completionSound}
              dispatch={dispatch}
              action='completionSound'
            />
          </div>
          <div>
            <label className='font-semibold  text-text-secondary '>Confirm before deletion</label>
            <ToggleSwitch
              checked={settings.confirmDeletion}
              dispatch={dispatch}
              action='confirmDeletion'
            />
          </div>
          <div>
            <label className='font-semibold  text-text-secondary '>Start of the week</label>
            <select
              className='mt-3 block cursor-pointer rounded-lg bg-background-tertiary px-3 py-1 font-medium text-text-tertiary focus:outline-none'
              value={settings.startOfTheWeek}
              onChange={(e) => {
                const value = e.target.value;
                dispatch({ type: 'startOfTheWeek', payload: value === 'default' ? value : +value });
              }}
            >
              <option value='default' >System default</option>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                (day, index) => (
                  <option value={index} key={day}>
                    {day}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, dispatch, action }) {
  return (
    <div className='relative mt-3 flex items-center gap-3'>
      <span className='font-medium text-text-tertiary'>{checked ? 'On' : 'Off'}</span>
      <label>
        <input
          type='checkbox'
          className='toggle-checkbox peer absolute appearance-none'
          checked={checked}
          onChange={(e) => dispatch({ type: action, payload: e.target.checked })}
        />
        <div
          className='toggle-switch relative
      h-5 w-10 cursor-pointer rounded-[20px] bg-background-tertiary transition-colors
      duration-300 before:absolute before:left-[3px] before:top-1 before:h-[13px] before:w-[13px] before:rounded-full before:bg-text-tertiary
      before:transition-[left] before:duration-300 
      peer-checked:bg-text-secondary peer-checked:before:left-6 peer-checked:before:bg-white
      '
        ></div>
      </label>
    </div>
  );
}
