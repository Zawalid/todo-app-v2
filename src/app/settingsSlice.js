import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_SETTINGS = {
  settings: {
    general: {
      preferences: {
        taskCompletionSound: true,
        deletionSound: true,
        animation: true,
        defaultHomeView: 'All',
      },
      dateAndTime: {
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'HH:mm',
        weekStart: 'monday',
        weeklyDueDate: 'sunday',
      },
      tasks: {
        defaultDueDate: '',
        autoDeleteCompletedTasks: false,
        taskDetailLevel: ['list', 'dueDate', 'priority', 'subtasks', 'tags'],
      },
      stickyNotes: {
        autoSave: true,
        defaultColor: '--custom-1',
      },
    },
    theme: {
      theme: 'light',
      autoDarkMode: true,
    },
    sidebar: {
      showInSideBar: ['all', 'today', 'upcoming', 'stickyWall'],
      showCount: true,
    },
  },
};

const settingsReducer = createSlice({
  initialState: DEFAULT_SETTINGS,
  name: 'settings',
  reducers: {
    updateSettings(state, action) {
      console.log(action.payload);
      state.general.preferences.animation = false;
    },
    resetSettings(state) {
      Object.assign(state, DEFAULT_SETTINGS);
    },
  },
});

export const { updateSettings, resetSettings } = settingsReducer.actions;

export default settingsReducer.reducer;
