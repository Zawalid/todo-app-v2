import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_SETTINGS = {
  general: {
    preferences: {
      taskCompletionSound: true,
      deletionSound: true,
      animation: true,
      defaultHomeView: 'inbox',
      deleteConfirmation: true,
      deletePermanently: false,
    },
    dateAndTime: {
      dateFormat: 'MM/dd/yyyy',
      timeFormat: 'HH:mm',
      weekStartsOn: 1,
    },
    tasks: {
      defaultDueDate: '',
      defaultPriority: 0,
      weeklyDueDate: 'Sunday',
      autoDeleteCompletedTasks: false,
      deletePermanently: false,
      taskDetailLevel: ['dueDate', 'list', 'priority', 'subtasks', 'tags'],
    },
    stickyNotes: {
      defaultColor: '--custom-1',
    },
  },
  theme: {
    themeMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    primaryTheme: 'indigo',
  },
  sidebar: {
    showInSideBar: ['inbox', 'stickyWall', 'today', 'upcoming', 'lists', 'tags'],
    showCount: true,
  },
  isDefault: true,
};

const settingsReducer = createSlice({
  initialState: DEFAULT_SETTINGS,
  name: 'settings',
  reducers: {
    updateSettings(state, action) {
      const { category, settings } = action.payload;
      state[category] = settings;
      state.isDefault = false;
      document.documentElement.setAttribute('data-animation', state.general.preferences.animation);
    },
    resetSettings(state) {
      Object.assign(state, DEFAULT_SETTINGS);
    },
    changeThemeMode(state, action) {
      state.theme.themeMode = action.payload;
      document.documentElement.classList.add('color-transition');
      document.documentElement.setAttribute('data-theme', action.payload);
      setTimeout(() => document.documentElement.classList.remove('color-transition'), 400);
    },
  },
});

export const { updateSettings, resetSettings, changeThemeMode } = settingsReducer.actions;

export default settingsReducer.reducer;
