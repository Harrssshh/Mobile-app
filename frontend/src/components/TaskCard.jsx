import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, IconButton, Avatar, AvatarGroup,
  Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, List, ListItem, ListItemAvatar, ListItemText as MListText
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch } from 'react-redux';
import {
  deleteTask,
  addComment,
  deleteComment,
  addAttachment,
  deleteAttachment
} from '../redux/taskSlice';

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
  completed: '#16a34a',
  High: '#ef4444',
  Low: '#f59e0b',
  Completed: '#16a34a'
};

const priorityBackgrounds = {
  high: '#fff1f2',
  medium: '#fffbeb',
  low: '#ecfdf5',
  completed: '#f0fdf4',
  High: '#fff1f2',
  Low: '#fffbeb',
  Completed: '#f0fdf4'
};

const TaskCard = ({ task, columnId, provided, onEdit, viewMode = 'spacious', viewLayout = 'board' }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const [newComment, setNewComment] = useState('');

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = () => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask({ columnId, taskId: task.id }));
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    if (typeof onEdit === 'function') onEdit(task, columnId);
  };

  const openComments = () => {
    setCommentsOpen(true);
    handleMenuClose();
  };
  const closeComments = () => {
    setCommentsOpen(false);
    setNewComment('');
  };
  const submitComment = () => {
    if (!newComment.trim()) return;
    const commentPayload = { text: newComment.trim(), author: 'You', id: Date.now().toString() };
    dispatch(addComment({
      columnId,
      taskId: task.id,
      comment: commentPayload
    }));
    setNewComment('');
  };
  const handleDeleteComment = (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    dispatch(deleteComment({ columnId, taskId: task.id, commentId }));
  };

  const openAttachments = () => {
    setAttachmentsOpen(true);
    handleMenuClose();
  };
  const closeAttachments = () => setAttachmentsOpen(false);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2,7);
      const url = URL.createObjectURL(file);
      dispatch(addAttachment({
        columnId,
        taskId: task.id,
        attachment: {
          id,
          name: file.name,
          url,
          size: file.size,
          mime: file.type
        }
      }));
    });
    e.target.value = null;
  };

  const handleDeleteAttachment = (attachmentId) => {
    if (!window.confirm('Delete this attachment?')) return;
    const att = (task.attachments || []).find(a => a.id === attachmentId);
    if (att && att.url && att.url.startsWith('blob:')) {
      try { URL.revokeObjectURL(att.url); } catch (err) {}
    }
    dispatch(deleteAttachment({ columnId, taskId: task.id, attachmentId }));
  };

  const priorityLabelRaw = task.priority || 'medium';
  const priorityLabel = String(priorityLabelRaw);
  const displayPriority = priorityLabel.charAt(0).toUpperCase() + priorityLabel.slice(1).toLowerCase();
  const commentsCount = (task.comments || []).length;
  const attachmentsCount = (task.attachments || []).length;

  const compact = viewMode === 'compact';
  const tile = viewLayout === 'grid';

  return (
    <>
      <Card
        ref={provided?.innerRef}
        {...(provided?.draggableProps || {})}
        {...(provided?.dragHandleProps || {})}
        sx={{
          mb: compact ? 1 : 2,
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #f3f4f6',
          backgroundColor: '#ffffff',
          ...(tile ? { width: '100%', height: '100%' } : {}),
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease',
          },
        }}
      >
        <CardContent sx={{ p: compact ? 1 : 2, '&:last-child': { pb: compact ? 1 : 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: compact ? 1 : 1.5 }}>
            <Chip
              label={displayPriority}
              size="small"
              sx={{
                backgroundColor: priorityBackgrounds[priorityLabel] || priorityBackgrounds[priorityLabelRaw] || '#fff',
                color: priorityColors[priorityLabel] || priorityColors[priorityLabelRaw] || '#111827',
                fontWeight: 500,
                fontSize: compact ? '0.6rem' : '0.6875rem',
                height: compact ? 18 : 20,
                borderRadius: 1,
                '& .MuiChip-label': { px: 1 },
              }}
            />

            <IconButton
              size="small"
              sx={{ p: 0, color: '#9ca3af' }}
              onClick={handleMenuOpen}
              aria-controls={menuOpen ? 'task-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? 'true' : undefined}
            >
              <MoreHorizIcon sx={{ fontSize: compact ? 16 : 20 }} />
            </IconButton>

        
          </Box>

          <Typography variant="h6" sx={{ fontSize: compact ? '0.85rem' : '0.95rem', fontWeight: 600, color: '#1f2937', mb: 0.75, lineHeight: 1.3 }}>
            {task.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: compact ? '0.72rem' : '0.8125rem', mb: 2, lineHeight: 1.5 }}>
            {task.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: compact ? 20 : 24, height: compact ? 20 : 24, fontSize: '0.75rem', border: '2px solid #ffffff' } }}>
              <Avatar sx={{ bgcolor: '#fbbf24' }} src="https://i.pravatar.cc/150?img=1" />
              <Avatar sx={{ bgcolor: '#f97316' }} src="https://i.pravatar.cc/150?img=2" />
              <Avatar sx={{ bgcolor: '#06b6d4' }} src="https://i.pravatar.cc/150?img=3" />
            </AvatarGroup>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: compact ? 1 : 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={openComments}>
                <ChatBubbleOutlineIcon sx={{ fontSize: compact ? 12 : 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: compact ? '0.65rem' : '0.75rem', color: '#6b7280' }}>{commentsCount} comments</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={openAttachments}>
                <AttachFileIcon sx={{ fontSize: compact ? 12 : 14, color: '#9ca3af' }} />
                <Typography sx={{ fontSize: compact ? '0.65rem' : '0.75rem', color: '#6b7280' }}>{attachmentsCount} files</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default TaskCard;
