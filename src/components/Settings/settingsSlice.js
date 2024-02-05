import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_SETTINGS = {
  general: {
    preferences: {
      taskCompletionSound: true,
      deletionSound: true,
      animation: true,
      defaultHomeView: 'inbox',
    },
    dateAndTime: {
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'HH:mm',
      weekStartsOn: 'Monday',
    },
    tasks: {
      defaultDueDate: '',
      defaultPriority: 0,
      weeklyDueDate: 'Sunday',
      autoDeleteCompletedTasks: false,
      taskDetailLevel: ['dueDate', 'list', 'priority', 'subtasks', 'tags'],
    },
    stickyNotes: {
      autoSave: true,
      defaultColor: '--custom-1',
    },
  },
  theme: {
    primaryTheme: 'indigo',
    autoDarkMode: true,
  },
  sidebar: {
    showInSideBar: ['inbox', 'stickyWall', 'today', 'upcoming', 'lists', 'tags'],
    showCount: true,
  },
};

const settingsReducer = createSlice({
  initialState: DEFAULT_SETTINGS,
  name: 'settings',
  reducers: {
    updateSettings(state, action) {
      const { category, settings } = action.payload;
      state.settings[category] = settings;
    },
    resetSettings(state) {
      Object.assign(state, DEFAULT_SETTINGS);
    },
  },
});

export const { updateSettings, resetSettings } = settingsReducer.actions;

export default settingsReducer.reducer;
