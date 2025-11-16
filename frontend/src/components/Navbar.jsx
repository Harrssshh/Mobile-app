import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Button
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const drawerWidth = 220;

const toIsoDay = (isoStr) => {
  if (!isoStr) return null;
  try {
    return new Date(isoStr).toISOString().slice(0, 10);
  } catch {
    return null;
  }
};

const daysBetween = (isoDayA, isoDayB) => {
  const a = new Date(isoDayA);
  const b = new Date(isoDayB);
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
};

const AUTO_MARK_MS = 5000; 

const Navbar = () => {
  const navigate = useNavigate();

  const columns = useSelector((s) => s.tasks?.columns || {});

  const [calendarMenuAnchor, setCalendarMenuAnchor] = useState(null);
  const [helpAnchor, setHelpAnchor] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [query] = useState('');

  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('read_notifications');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('read_notifications', JSON.stringify(readNotifications));
    } catch {}
  }, [readNotifications]);

  const allTasks = useMemo(() => {
    const arr = [];
    Object.entries(columns).forEach(([colId, col]) => {
      const tasks = col?.tasks || [];
      tasks.forEach((t) => arr.push({ ...t, __columnId: colId }));
    });
    return arr;
  }, [columns]);

  const todayIso = new Date().toISOString().slice(0, 10);

  const notifications = useMemo(() => {
    const list = [];
    allTasks.forEach((task) => {
      // ignore tasks without dueDate
      if (!task?.dueDate) return;

      const taskDay = toIsoDay(task.dueDate);
      if (!taskDay) return;

      const diff = daysBetween(taskDay, todayIso); 

      if (task.__columnId === 'done') return;

      if (diff < 0) {
        list.push({
          id: task.id,
          title: task.name || task.title || 'Untitled',
          dueDate: taskDay,
          status: 'overdue',
          diff,
          column: task.__columnId,
        });
      } else if (diff === 0) {
        list.push({
          id: task.id,
          title: task.name || task.title || 'Untitled',
          dueDate: taskDay,
          status: 'today',
          diff,
          column: task.__columnId,
        });
      } else if (diff <= 2) {
        list.push({
          id: task.id,
          title: task.name || task.title || 'Untitled',
          dueDate: taskDay,
          status: 'soon',
          diff,
          column: task.__columnId,
        });
      }
    });

    const order = { overdue: 0, today: 1, soon: 2 };
    list.sort((a, b) => {
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return daysBetween(a.dueDate, b.dueDate);
    });

    return list;
  }, [allTasks, todayIso]);

  const unread = useMemo(() => notifications.filter((n) => !readNotifications.includes(n.id)).length, [notifications, readNotifications]);

  const openNotif = (e) => {
    setNotifAnchor(e.currentTarget);
  };
  const closeNotif = () => setNotifAnchor(null);

  const goToTask = (taskId) => {
    try { localStorage.setItem('focus_task_id', taskId); } catch {}
    navigate('/');
    closeNotif();
  };

  const markAsRead = useCallback((taskId) => {
    setReadNotifications((prev) => {
      if (prev.includes(taskId)) return prev;
      return [...prev, taskId];
    });
  }, []);

  const markAllRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications((prev) => {
      const merged = new Set(prev);
      allIds.forEach((id) => merged.add(id));
      return Array.from(merged);
    });
  }, [notifications]);

  useEffect(() => {
    if (unread <= 0) return;
    if (notifAnchor) return;

    const timer = setTimeout(() => {
      const idsToMark = notifications.map(n => n.id).filter(id => !readNotifications.includes(id));
      if (idsToMark.length > 0) {
        setReadNotifications(prev => {
          const merged = new Set(prev);
          idsToMark.forEach(id => merged.add(id));
          return Array.from(merged);
        });
      }
    }, AUTO_MARK_MS);

    return () => clearTimeout(timer);
  }, [unread, notifications, notifAnchor]); 

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  const user = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_user') || 'null');
      return u || null;
    } catch {
      return null;
    }
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={(theme) => ({
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar
        sx={{
          py: 2.2,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: 64,
        }}
      >
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          <TextField
            placeholder="Search for anything..."
            variant="outlined"
            size="small"
            fullWidth
            value={query}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                backgroundColor: '#ffffff',
                fontSize: '0.875rem',
                '& fieldset': { borderColor: '#e5e7eb' },
              },
            }}
          />
        </Box>
        

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0, justifyContent: 'flex-end' }}>
          <IconButton size="small" onClick={(e) => setCalendarMenuAnchor(e.currentTarget)} sx={{ width: 36, height: 36 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: '#6b7280' }} />
          </IconButton>
          <Menu anchorEl={calendarMenuAnchor} open={Boolean(calendarMenuAnchor)} onClose={() => setCalendarMenuAnchor(null)}>
            <MenuItem>Today</MenuItem>
            <MenuItem>This Week</MenuItem>
            <MenuItem>This Month</MenuItem>
          </Menu>

          <IconButton size="small" onClick={(e) => setHelpAnchor(e.currentTarget)} sx={{ width: 36, height: 36 }}>
            <HelpOutlineIcon sx={{ fontSize: 20, color: '#6b7280' }} />
          </IconButton>
          <Menu anchorEl={helpAnchor} open={Boolean(helpAnchor)} onClose={() => setHelpAnchor(null)}>
            <MenuItem>Documentation</MenuItem>
            <MenuItem>Support</MenuItem>
            <MenuItem>Shortcuts Guide</MenuItem>
          </Menu>

          <IconButton size="small" onClick={openNotif} sx={{ width: 36, height: 36 }}>
            <Badge badgeContent={unread} color="error" invisible={unread === 0}>
              <NotificationsNoneIcon sx={{ fontSize: 20, color: '#6b7280' }} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={closeNotif}
            PaperProps={{ sx: { width: 360, maxWidth: '90vw' } }}
          >
            <List
              dense
              subheader={
                <ListSubheader component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Notifications</span>
                  <Button size="small" onClick={markAllRead} disabled={notifications.length === 0}>
                    Mark all read
                  </Button>
                </ListSubheader>
              }
            >
              {notifications.length === 0 && (
                <ListItem>
                  <ListItemText primary="No due reminders" secondary="You're all caught up ✅" />
                </ListItem>
              )}

              {['overdue', 'today', 'soon'].map((group) => {
                const groupItems = notifications.filter((n) => n.status === group);
                if (groupItems.length === 0) return null;
                const headerLabel = group === 'overdue' ? 'Overdue' : group === 'today' ? 'Due Today' : 'Due Soon';
                return (
                  <Box key={group} sx={{ px: 1 }}>
                    <ListSubheader sx={{ pt: 1, pb: 0.5, fontWeight: 700 }}>{headerLabel}</ListSubheader>
                    {groupItems.map((n) => {
                      const read = readNotifications.includes(n.id);
                      return (
                        <ListItem
                          key={n.id}
                          divider
                          secondaryAction={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              {!read && <Button size="small" onClick={() => markAsRead(n.id)}>Mark read</Button>}
                              <Button size="small" variant="contained" onClick={() => goToTask(n.id)}>Open</Button>
                            </Box>
                          }
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</Typography>
                                {read ? <Typography sx={{ fontSize: 11, color: '#6b7280' }}>(read)</Typography> : null}
                              </Box>
                            }
                            secondary={`Due: ${n.dueDate} • ${n.column || ''}`}
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </Menu>

          <Box onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', pl: 1.25, borderLeft: '1px solid #e5e7eb', ml: 1 }}>
            <Box sx={{ textAlign: 'right', lineHeight: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>
                {user?.name || (user?.email ? user.email.split('@')[0] : 'User')}
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                {user?.location || ''}
              </Typography>
            </Box>

            <Avatar sx={{ width: 36, height: 36, bgcolor: '#7c3aed' }} src={user?.avatar || 'https://i.pravatar.cc/150?img=5'} />
            <ExpandMoreIcon sx={{ color: '#9ca3af' }} />
          </Box>

          <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
            <MenuItem onClick={() => { setProfileAnchor(null); navigate('/profile'); }}>Profile</MenuItem>
            <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings'); }}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};  

export default Navbar;
