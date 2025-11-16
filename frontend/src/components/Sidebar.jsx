import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 220;

const collapsedWidth = 72; 

const menuItems = [
  { text: 'Home', icon: <GridViewRoundedIcon />, active: false },
  { text: 'Messages', icon: <ChatBubbleOutlineRoundedIcon />, active: false },
  { text: 'Tasks', icon: <AssignmentOutlinedIcon />, active: true },
  { text: 'Members', icon: <PeopleAltOutlinedIcon />, active: false },
  { text: 'Settings', icon: <SettingsOutlinedIcon />, active: false },
];

const projects = [
  { name: 'Mobile App', color: '#7c3aed', active: true },
  { name: 'Website Redesign', color: '#f97316', active: false },
  { name: 'Design System', color: '#8b5cf6', active: false },
  { name: 'Wireframes', color: '#3b82f6', active: false },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const width = open ? drawerWidth : collapsedWidth;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          backgroundColor: '#fafafa',
          borderRight: '1px solid #e5e7eb',
          transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
          overflowX: 'hidden'
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          gap: 1.5,
          px:  2,
          py: 2.5,
        }}
      >
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         <Box
          sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 40 40">
        <circle cx="20" cy="12" r="10" fill="#4C1DFF" />
        <circle cx="14" cy="24" r="10" fill="#7C5CFF" />
        <circle cx="26" cy="24" r="10" fill="#B1A2FF" />
        </svg>
        </Box>


          <Box
            sx={{
              overflow: 'hidden',
              transition: 'all 160ms',
              opacity: open ? 1 : 0,
              width: open ? 'auto' : 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              Project M.
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Navigation">
         <IconButton
          size="small"
          sx={{
            borderRadius: 1.5,
            color: '#6b7280',
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: '#f3f4f6' }
        }} 
       >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
       </Tooltip>
      </Box>

      <Divider />

      <List sx={{ px: open ? 2 : 1, mb: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: open ? 1 : 0.5,
                backgroundColor: item.active ? '#ffffff' : 'transparent',
                boxShadow: item.active ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                '&:hover': {
                  backgroundColor: item.active ? '#ffffff' : '#f3f4f6',
                },
                justifyContent: open ? 'initial' : 'center'
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: item.active ? '#7c3aed' : '#9ca3af',
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: item.active ? 600 : 400,
                  color: item.active ? '#1f2937' : '#6b7280',
                }}
                sx={{
                  ml: 0,
                  transition: 'opacity 160ms',
                  opacity: open ? 1 : 0,
                  width: open ? 'auto' : 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: open ? 2 : 1 }} />

      <Box sx={{ px: open ? 2 : 1, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: open ? 'space-between' : 'center', alignItems: 'center', mb: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              overflow: 'hidden'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.7rem',
                opacity: open ? 1 : 0
              }}
            >
              MY PROJECTS
            </Typography>
          </Box>

          <Box sx={{ display: open ? 'block' : 'none' }}>
            <AddIcon sx={{ fontSize: 16, color: '#9ca3af', cursor: 'pointer' }} />
          </Box>
        </Box>

        <List sx={{ py: 0 }}>
          {projects.map((project) => (
            <ListItem key={project.name} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 1.5,
                  py: 0.75,
                  px: open ? 1 : 0.5,
                  backgroundColor: project.active ? '#ffffff' : 'transparent',
                  boxShadow: project.active ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  '&:hover': {
                    backgroundColor: project.active ? '#ffffff' : '#f3f4f6',
                  },
                  justifyContent: open ? 'initial' : 'center'
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, justifyContent: 'center' }}>
                  <CircleIcon sx={{ fontSize: 10, color: project.color }} />
                </ListItemIcon>

                <ListItemText
                  primary={project.name}
                  primaryTypographyProps={{
                    fontSize: '0.8125rem',
                    fontWeight: project.active ? 600 : 400,
                    color: project.active ? '#1f2937' : '#6b7280',
                  }}
                  sx={{
                    ml: 0,
                    transition: 'opacity 160ms',
                    opacity: open ? 1 : 0,
                    width: open ? 'auto' : 0,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          mx: open ? 2 : 1,
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <EmojiObjectsOutlinedIcon sx={{ fontSize: 24, color: '#f59e0b' }} />
        </Box>

         <Typography 
          sx={{ 
          fontSize: '0.875rem', 
          fontWeight: 600, 
          color: '#1f2937', 
          mb: 0.75,
          textAlign: 'center',
          whiteSpace: 'normal'
          }}
        >
         Thoughts Time
        </Typography>

        <Typography 
          sx={{ 
            fontSize: '0.75rem', 
            color: '#9ca3af', 
            mb: 1.5, 
            lineHeight: 1.4,
            textAlign: 'center',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}
        >
        We don't have any notice for you, till then you can share your thoughts with your peers.
        </Typography>

        <Box
          component="button"
          sx={{
            width: '100%',
            py: 1,
            px: 2,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 1.5,
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#6b7280',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
            opacity: open ? 1 : 0
          }}
        >
          Write a message
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
