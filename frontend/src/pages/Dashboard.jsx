import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, IconButton, Avatar, AvatarGroup,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, List, ListItem, ListItemAvatar, ListItemSecondaryAction, Checkbox, TextareaAutosize
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import GridViewIcon from '@mui/icons-material/GridView';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';

import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';
import ShareDialog from '../components/ShareDialog';
import { moveTask, setDateFilter, setFilter } from '../redux/taskSlice';

import { updateTask, deleteTask } from '../redux/taskSlice';

const drawerWidth = 96;

const Dashboard = () => {
  const dispatch = useDispatch();
  const columns = useSelector(state => state.tasks.columns);
  const filter = useSelector(state => state.tasks.filter);
  const dateFilter = useSelector(state => state.tasks.dateFilter);

  const [projectName, setProjectName] = useState('Mobile App');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [editingTask, setEditingTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [shareOpen, setShareOpen] = useState(false);
  const [viewMode, setViewMode] = useState('spacious');

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);

  const [titleEditOpen, setTitleEditOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState(projectName);

  const [copiedOpen, setCopiedOpen] = useState(false);

  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [focusedTask, setFocusedTask] = useState(null);  
  const [focusedColumn, setFocusedColumn] = useState(null);

  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleOpenModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task, columnId) => {
    setSelectedColumn(columnId);
    setEditingTask(task);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedColumn(null);
    setEditingTask(null);
    setIsEditMode(false);
  };

  const handleOpenDetail = (task, columnId) => {
    setFocusedTask(task);
    setFocusedColumn(columnId);
    setNewSubtaskText('');
    setTaskDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setTaskDetailOpen(false);
    setFocusedTask(null);
    setFocusedColumn(null);
  };

  const persistTaskUpdate = (columnId, updatedTask) => {
    try {
      dispatch(updateTask({ columnId, task: updatedTask }));
    } catch (err) {
      console.warn('Dispatch updateTask failed — ensure updateTask exists in taskSlice:', err);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    dispatch(moveTask({
      sourceColumnId: source.droppableId,
      destColumnId: destination.droppableId,
      sourceIndex: source.index,
      destIndex: destination.index
    }));
  };

  const isSameDay = (isoDateA, isoDateB) => {
    if (!isoDateA || !isoDateB) return false;
    return isoDateA === isoDateB;
  };

  const isThisWeek = (isoDate) => {
    if (!isoDate) return false;
    const d = new Date(isoDate);
    const now = new Date();
    const getWeekStart = (date) => {
      const d2 = new Date(date);
      const day = (d2.getDay() + 6) % 7;
      d2.setDate(d2.getDate() - day);
      d2.setHours(0,0,0,0);
      return d2;
    };
    const startNow = getWeekStart(now);
    const startThen = getWeekStart(d);
    return startNow.getTime() === startThen.getTime();
  };

  const isThisMonth = (isoDate) => {
    if (!isoDate) return false;
    const d = new Date(isoDate);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const getFilteredTasks = (tasks) => {
    let res = tasks.slice();

    if (filter && filter !== 'all') {
      res = res.filter(task => task.priority === filter);
    }

    if (dateFilter && dateFilter.type) {
      if (dateFilter.type === 'today') {
        const today = new Date();
        const isoToday = today.toISOString().slice(0,10);
        res = res.filter(task => isSameDay(task.dueDate, isoToday));
      } else if (dateFilter.type === 'week') {
        res = res.filter(task => isThisWeek(task.dueDate));
      } else if (dateFilter.type === 'month') {
        res = res.filter(task => isThisMonth(task.dueDate));
      } else if (dateFilter.type === 'custom' && dateFilter.date) {
        res = res.filter(task => isSameDay(task.dueDate, dateFilter.date));
      }
    }

    return res;
  };

  const columnBorderColors = {
    todo: '#5B93FF',
    inProgress: '#FFA629',
    done: '#8BC48A'
  };

  const columnDotColors = {
    todo: '#5B93FF',
    inProgress: '#FFA629',
    done: '#8BC48A'
  };

  const openFilterMenu = (e) => setFilterAnchorEl(e.currentTarget);
  const closeFilterMenu = () => setFilterAnchorEl(null);
  const handleFilterSelect = (value) => {
    dispatch(setFilter(value));
    closeFilterMenu();
  };

  const openCalendarMenu = (e) => setCalendarAnchorEl(e.currentTarget);
  const closeCalendarMenu = () => setCalendarAnchorEl(null);
  const handleCalendarSelect = (type, customDate = null) => {
    if (type === 'clear') {
      dispatch(setDateFilter(null));
    } else if (type === 'custom') {
      dispatch(setDateFilter({ type: 'custom', date: customDate }));
    } else {
      dispatch(setDateFilter({ type }));
    }
    closeCalendarMenu();
  };

  const handleOpenShare = () => setShareOpen(true);
  const handleCloseShare = () => setShareOpen(false);
  const handleInvite = (email) => console.log('Invite:', email);

  const toggleViewMode = () => setViewMode(prev => (prev === 'spacious' ? 'compact' : 'spacious'));

  const openTitleEdit = () => {
    setTitleDraft(projectName);
    setTitleEditOpen(true);
  };
  const closeTitleEdit = () => {
    setTitleEditOpen(false);
    setTitleDraft(projectName);
  };
  const saveTitleEdit = () => {
    const newName = titleDraft.trim() || 'Untitled Project';
    setProjectName(newName);
    setTitleEditOpen(false);
  };

  const copyProjectLink = async () => {
    const slug = projectName.replace(/\s+/g, '-').toLowerCase();
    const inviteLink = `${window.location.origin}/projects/${encodeURIComponent(slug)}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        const tmp = document.createElement('textarea');
        tmp.value = inviteLink;
        tmp.style.position = 'fixed';
        tmp.style.left = '-9999px';
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      setCopiedOpen(true);
      setTimeout(() => setCopiedOpen(false), 1600);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  useEffect(() => {
    try {
      const focusId = localStorage.getItem('focus_task_id');
      if (!focusId) return;

      let found = null;
      let foundColumn = null;
      for (const [colId, col] of Object.entries(columns || {})) {
        const t = (col.tasks || []).find(x => x.id === focusId);
        if (t) {
          found = t;
          foundColumn = colId;
          break;
        }
      }

      if (found && foundColumn) {
        handleOpenDetail(found, foundColumn);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('focus_task effect error', err);
    } finally {
      try { localStorage.removeItem('focus_task_id'); } catch {}
    }
  }, [columns]); 

  const addSubtask = () => {
    if (!newSubtaskText?.trim() || !focusedTask) return;
    const newSubtask = {
      id: `sub_${Date.now()}`,
      text: newSubtaskText.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updated = {
      ...focusedTask,
      subtasks: [...(focusedTask.subtasks || []), newSubtask]
    };
    setFocusedTask(updated);
    setNewSubtaskText('');
    persistTaskUpdate(focusedColumn, updated);
  };

  const toggleSubtask = (subId) => {
    if (!focusedTask) return;
    const updated = {
      ...focusedTask,
      subtasks: (focusedTask.subtasks || []).map(s => s.id === subId ? { ...s, completed: !s.completed } : s)
    };
    setFocusedTask(updated);
    persistTaskUpdate(focusedColumn, updated);
  };

  const removeSubtask = (subId) => {
    if (!focusedTask) return;
    const updated = {
      ...focusedTask,
      subtasks: (focusedTask.subtasks || []).filter(s => s.id !== subId)
    };
    setFocusedTask(updated);
    persistTaskUpdate(focusedColumn, updated);
  };

  const addComment = (text) => {
    if (!text?.trim() || !focusedTask) return;
    const newC = {
      id: `c_${Date.now()}`,
      text: text.trim(),
      author: (() => {
        try { const u = JSON.parse(localStorage.getItem('auth_user') || 'null'); return u?.name || u?.email || 'You'; } catch { return 'You'; }
      })(),
      createdAt: new Date().toISOString()
    };
    const updated = {
      ...focusedTask,
      comments: [...(focusedTask.comments || []), newC]
    };
    setFocusedTask(updated);
    persistTaskUpdate(focusedColumn, updated);
  };

  const addFile = (fileName) => {
    if (!fileName?.trim() || !focusedTask) return;
    const updated = {
      ...focusedTask,
      files: [...(focusedTask.files || []), { id: `f_${Date.now()}`, name: fileName.trim(), uploadedAt: new Date().toISOString() }]
    };
    setFocusedTask(updated);
    persistTaskUpdate(focusedColumn, updated);
  };

  // --------- handleDeleteDetail: confirm -> dispatch deleteTask -> close dialog
  const handleDeleteDetail = () => {
    if (!focusedTask || !focusedColumn) return;
    const ok = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (!ok) return;

    try {
      dispatch(deleteTask({ columnId: focusedColumn, taskId: focusedTask.id }));
    } catch (err) {
      console.error('deleteTask dispatch failed', err);
    } finally {
      handleCloseDetail();
    }
  };
  // ---------

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '90px',
          ml: `80px`,
          backgroundColor: '#fafafa',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '2.25rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {projectName}
                </Typography>

                <Tooltip title="Edit project name">
                  <IconButton size="small" onClick={() => setTitleEditOpen(true)} sx={{ color: '#7c3aed' }}>
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Copy project link">
                  <IconButton size="small" onClick={copyProjectLink} sx={{ color: '#7c3aed' }}>
                    <LinkIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button startIcon={<AddIcon />} variant="text" sx={{ color: '#7c3aed', textTransform: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                Invite
              </Button>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.75rem', border: '2px solid #ffffff' } }}>
                <Avatar sx={{ bgcolor: '#fbbf24' }} src="https://i.pravatar.cc/150?img=11" />
                <Avatar sx={{ bgcolor: '#f97316' }} src="https://i.pravatar.cc/150?img=12" />
                <Avatar sx={{ bgcolor: '#06b6d4' }} src="https://i.pravatar.cc/150?img=13" />
                <Avatar sx={{ bgcolor: '#8b5cf6' }} src="https://i.pravatar.cc/150?img=14" />
                <Avatar sx={{ bgcolor: '#ec4899' }}>+2</Avatar>
              </AvatarGroup>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<FilterListIcon />} variant="outlined" onClick={openFilterMenu} sx={{ textTransform: 'none', fontSize: '0.875rem', borderColor: '#e5e7eb', color: '#6b7280', borderRadius: 1.5 }}>
                {filter === 'all' ? 'Filter' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>

              <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={closeFilterMenu}>
                <MenuItem onClick={() => handleFilterSelect('all')}><ListItemIcon><FilterListIcon fontSize="small" /></ListItemIcon><ListItemText>All</ListItemText></MenuItem>
                <MenuItem onClick={() => handleFilterSelect('high')}><ListItemText>High</ListItemText></MenuItem>
                <MenuItem onClick={() => handleFilterSelect('medium')}><ListItemText>Medium</ListItemText></MenuItem>
                <MenuItem onClick={() => handleFilterSelect('low')}><ListItemText>Low</ListItemText></MenuItem>
              </Menu>

              <Button startIcon={<CalendarTodayOutlinedIcon />} variant="outlined" onClick={openCalendarMenu} sx={{ textTransform: 'none', fontSize: '0.875rem', borderColor: '#e5e7eb', color: '#6b7280', borderRadius: 1.5 }}>
                {dateFilter ? (dateFilter.type === 'custom' ? dateFilter.date : dateFilter.type.toUpperCase()) : 'Today'}
              </Button>

              <Menu anchorEl={calendarAnchorEl} open={Boolean(calendarAnchorEl)} onClose={closeCalendarMenu}>
                <MenuItem onClick={() => handleCalendarSelect('today')}><ListItemIcon><TodayIcon fontSize="small" /></ListItemIcon><ListItemText>Today</ListItemText></MenuItem>
                <MenuItem onClick={() => handleCalendarSelect('week')}><ListItemIcon><DateRangeIcon fontSize="small" /></ListItemIcon><ListItemText>This week</ListItemText></MenuItem>
                <MenuItem onClick={() => handleCalendarSelect('month')}><ListItemIcon><EventAvailableIcon fontSize="small" /></ListItemIcon><ListItemText>This month</ListItemText></MenuItem>
                <Divider />
                <MenuItem><input type="date" onChange={(e) => { if (e.target.value) handleCalendarSelect('custom', e.target.value); }} style={{ border: 'none', outline: 'none' }} /></MenuItem>
                <Divider />
                <MenuItem onClick={() => handleCalendarSelect('clear')}><ListItemText>Clear date filter</ListItemText></MenuItem>
              </Menu>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button startIcon={<IosShareIcon />} variant="outlined" onClick={handleOpenShare} sx={{ textTransform: 'none', fontSize: '0.875rem', borderColor: '#e5e7eb', color: '#6b7280', borderRadius: 1.5 }}>
                Share
              </Button>

              <Tooltip title={viewMode === 'spacious' ? 'Switch to compact view' : 'Switch to spacious view'}>
                <IconButton onClick={toggleViewMode} sx={{ border: viewMode === 'compact' ? '1px solid #7c3aed' : '1px solid #e5e7eb', backgroundColor: viewMode === 'compact' ? '#7c3aed' : 'transparent', color: viewMode === 'compact' ? '#fff' : '#6b7280', borderRadius: 1.5, width: 36, height: 36 }}>
                  {viewMode === 'compact' ? <GridViewIcon sx={{ fontSize: 20 }} /> : <GridViewOutlinedIcon sx={{ fontSize: 20 }} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {Object.entries(columns).map(([columnId, column]) => (
              <Paper key={columnId} elevation={0} sx={{ borderRadius: 2.5, backgroundColor: '#ffffff', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                <Box sx={{ borderTop: `4px solid ${columnBorderColors[columnId]}`, p: 2.5, pb: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: columnDotColors[columnId] }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>{column.title}</Typography>
                      <Box sx={{ backgroundColor: '#f3f4f6', borderRadius: '12px', px: 1.25, py: 0.25 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{getFilteredTasks(column.tasks).length}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => handleOpenModal(columnId)} sx={{ backgroundColor: '#f9fafb', color: '#6b7280', width: 24, height: 24, '&:hover': { backgroundColor: '#f3f4f6' } }}>
                      <AddIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ px: 2.5, pb: 2.5, minHeight: 200, backgroundColor: snapshot.isDraggingOver ? '#f9fafb' : 'transparent', transition: 'background-color 0.2s ease' }}>
                      {getFilteredTasks(column.tasks).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.8 : 1 }}
                              onClick={() => { if (!snapshot.isDragging) handleOpenDetail(task, columnId); }}
                            >
                              <TaskCard task={task} columnId={columnId} provided={provided} onEdit={() => handleOpenEditModal(task, columnId)} viewMode={viewMode} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Paper>
            ))}
          </Box>
        </DragDropContext>

        <AddTaskModal open={modalOpen} onClose={handleCloseModal} columnId={selectedColumn} initialData={editingTask} isEdit={isEditMode} />

        <ShareDialog open={shareOpen} onClose={handleCloseShare} projectName={projectName} projectId={projectName.replace(/\s+/g, '-').toLowerCase()} onInvite={handleInvite} />

        <Dialog open={titleEditOpen} onClose={closeTitleEdit}>
          <DialogTitle>Edit project name</DialogTitle>
          <DialogContent>
            <TextField fullWidth value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} label="Project name" />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeTitleEdit}>Cancel</Button>
            <Button onClick={saveTitleEdit} variant="contained" sx={{ textTransform: 'none' }}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={taskDetailOpen} onClose={handleCloseDetail} fullWidth maxWidth="md">
          <DialogTitle>
            {focusedTask?.title || focusedTask?.name || 'Task details'}
          </DialogTitle>
          <DialogContent dividers>
            {focusedTask ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Description</Typography>
                  <Paper sx={{ p: 2, mb: 2 }}>{focusedTask.description || <em>No description</em>}</Paper>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CommentIcon />
                    <Typography sx={{ fontWeight: 700 }}>Comments</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <List dense>
                      {(focusedTask.comments || []).map(c => (
                        <ListItem key={c.id} sx={{ alignItems: 'flex-start' }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32 }}>{(c.author || 'U')[0]}</Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<strong>{c.author}</strong>} secondary={<><Typography component="span" sx={{ display: 'block' }}>{c.text}</Typography><Typography component="span" sx={{ fontSize: 12, color: '#6b7280' }}>{new Date(c.createdAt).toLocaleString()}</Typography></>} />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <TextField fullWidth size="small" placeholder="Write a comment..." onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addComment(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }} />
                      <Button variant="contained" onClick={() => {
                        const el = document.activeElement;
                        const inputs = document.querySelectorAll('[placeholder="Write a comment..."]');
                        if (inputs && inputs.length) {
                          const v = inputs[0].value;
                          if (v && v.trim()) {
                            addComment(v);
                            inputs[0].value = '';
                          }
                        }
                      }}>Send</Button>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachmentIcon />
                    <Typography sx={{ fontWeight: 700 }}>Files</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <List dense>
                      {(focusedTask.files || []).map(f => (
                        <ListItem key={f.id}>
                          <ListItemText primary={f.name} secondary={new Date(f.uploadedAt).toLocaleString()} />
                          <ListItemSecondaryAction>
                            <Button size="small">Download</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField size="small" placeholder="Filename to add (demo)" value={''} onChange={() => { }} />
                      <Button variant="outlined" onClick={() => {
                        const filename = `file_${Date.now()}.txt`;
                        addFile(filename);
                      }}>Add file (demo)</Button>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Status</Typography>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{focusedColumn}</Typography>

                    <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Due</Typography>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{focusedTask.dueDate || '—'}</Typography>

                    <Divider sx={{ my: 1 }} />

                    <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Priority</Typography>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{focusedTask.priority || 'Normal'}</Typography>
                  </Paper>

                  <Paper sx={{ p: 2 }}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Subtasks</Typography>

                    <List dense>
                      {(focusedTask.subtasks || []).map(sub => (
                        <ListItem key={sub.id} divider>
                          <Checkbox checked={!!sub.completed} onChange={() => toggleSubtask(sub.id)} />
                          <ListItemText primary={sub.text} secondary={sub.completed ? 'Done' : ''} />
                          <ListItemSecondaryAction>
                            <Button size="small" onClick={() => removeSubtask(sub.id)}>Delete</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                      {(!focusedTask.subtasks || focusedTask.subtasks.length === 0) && <Typography sx={{ color: '#6b7280' }}>No subtasks yet</Typography>}
                    </List>

                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <TextField size="small" placeholder="New subtask" value={newSubtaskText} onChange={(e) => setNewSubtaskText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addSubtask(); }} />
                      <Button variant="contained" onClick={addSubtask}>Add</Button>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            ) : (
              <Typography>No task selected</Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              if (focusedTask && focusedColumn) {
                handleCloseDetail();
                handleOpenEditModal(focusedTask, focusedColumn);
              }
            }}>Edit</Button>

            <Button
              onClick={handleDeleteDetail}
              color="error"
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>

            <Button onClick={handleCloseDetail}>Close</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={copiedOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setCopiedOpen(false)} autoHideDuration={1500}>
          <Alert severity="success" sx={{ width: '100%' }}>Link copied to clipboard</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Dashboard;
