import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import { loadState, saveState } from '../utils/localStorage';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
