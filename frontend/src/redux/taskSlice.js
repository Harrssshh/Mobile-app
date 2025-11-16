import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columns: {
    todo: { id: 'todo', title: 'To Do', tasks: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', tasks: [] },
    done: { id: 'done', title: 'Done', tasks: [] }
  },
  filter: 'all',
  dateFilter: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      const priorityRaw = task.priority || 'medium';
      const priority = String(priorityRaw).trim().toLowerCase();
      const newTask = {
        id: Date.now().toString(),
        title: task.title,
        description: task.description,
        priority,
        category: task.category || 'General',
        createdAt: new Date().toISOString(),
        dueDate: task.dueDate || null,
        comments: [],     
        attachments: []   
      };
      state.columns[columnId].tasks.push(newTask);
    },

    moveTask: (state, action) => {
      const { sourceColumnId, destColumnId, sourceIndex, destIndex } = action.payload;
      const sourceColumn = state.columns[sourceColumnId];
      const destColumn = state.columns[destColumnId];
      const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
      destColumn.tasks.splice(destIndex, 0, movedTask);
    },

    deleteTask: (state, action) => {
      const { columnId, taskId } = action.payload;
      state.columns[columnId].tasks = state.columns[columnId].tasks.filter(
        task => task.id !== taskId
      );
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },

    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },

    updateTask: (state, action) => {
      const { columnId, taskId, updates } = action.payload;
      const col = state.columns[columnId];
      if (!col) return;
      const idx = col.tasks.findIndex(t => t.id === taskId);
      if (idx === -1) return;
      const merged = {
        ...col.tasks[idx],
        ...updates,
        priority: updates.priority ? String(updates.priority).toLowerCase() : col.tasks[idx].priority
      };
      col.tasks[idx] = merged;
    },

   
    addComment: (state, action) => {
      const { columnId, taskId, comment } = action.payload;
      const col = state.columns[columnId];
      if (!col) return;
      const t = col.tasks.find(x => x.id === taskId);
      if (!t) return;
      const newComment = {
        id: Date.now().toString(),
        author: comment.author || 'You',
        text: comment.text,
        createdAt: new Date().toISOString()
      };
      if (!t.comments) t.comments = [];
      t.comments.push(newComment);
    },


    deleteComment: (state, action) => {
      const { columnId, taskId, commentId } = action.payload;
      const col = state.columns[columnId];
      if (!col) return;
      const t = col.tasks.find(x => x.id === taskId);
      if (!t || !t.comments) return;
      t.comments = t.comments.filter(c => c.id !== commentId);
    },

   
    addAttachment: (state, action) => {
      const { columnId, taskId, attachment } = action.payload;
      const col = state.columns[columnId];
      if (!col) return;
      const t = col.tasks.find(x => x.id === taskId);
      if (!t) return;
      if (!t.attachments) t.attachments = [];
      t.attachments.push(attachment);
    },


    deleteAttachment: (state, action) => {
      const { columnId, taskId, attachmentId } = action.payload;
      const col = state.columns[columnId];
      if (!col) return;
      const t = col.tasks.find(x => x.id === taskId);
      if (!t || !t.attachments) return;
      t.attachments = t.attachments.filter(a => a.id !== attachmentId);
    },

    normalizePriorities: (state) => {
      Object.values(state.columns).forEach(col => {
        col.tasks = col.tasks.map(t => ({
          ...t,
          priority: t.priority ? String(t.priority).trim().toLowerCase() : 'medium',
          comments: t.comments || [],
          attachments: t.attachments || []
        }));
      });
    }
  }
});

export const {
  addTask,
  moveTask,
  deleteTask,
  setFilter,
  setDateFilter,
  updateTask,
  removeTask,
  addComment,
  deleteComment,
  addAttachment,
  deleteAttachment,
  normalizePriorities
} = taskSlice.actions;

export default taskSlice.reducer;
