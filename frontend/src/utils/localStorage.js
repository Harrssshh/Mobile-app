export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('taskDashboardState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('taskDashboardState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};
