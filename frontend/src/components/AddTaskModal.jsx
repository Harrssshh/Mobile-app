// src/components/AddTaskModal.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../redux/taskSlice'; // adjust path if needed

const capitalize = (s) => {
  if (!s) return s;
  const str = String(s);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const AddTaskModal = ({ open, onClose, columnId, initialData = null, isEdit = false }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium'); 
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState(''); 

  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority ? capitalize(initialData.priority) : 'Medium');
      setCategory(initialData.category || 'General');
      setDueDate(initialData.dueDate || '');
    } else if (!open) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('General');
      setDueDate('');
    }
  }, [isEdit, initialData, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const payloadTask = {
      title: title.trim(),
      description: description.trim(),
      priority: String(priority).toLowerCase(),
      category,
      dueDate: dueDate || null
    };

    if (isEdit && initialData) {
      dispatch(updateTask({
        columnId,
        taskId: initialData.id,
        updates: payloadTask
      }));
    } else {
      dispatch(addTask({
        columnId,
        task: payloadTask
      }));
    }

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('General');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        {isEdit ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Task Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <TextField
            label="Task Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Development">Development</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Due Date (optional)"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
          sx={{
            backgroundColor: '#5b7cff',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              backgroundColor: '#4a6bdf',
            }
          }}
        >
          {isEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
