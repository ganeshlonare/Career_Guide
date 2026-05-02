import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  Fade,
} from '@mui/material';
import {
  NotificationsNone as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Close as CloseIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Popper } from '@mui/material';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const NotificationPaper = styled(Paper)(({ theme }) => ({
  width: '380px',
  maxHeight: '480px',
  borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  animation: `${slideIn} 0.3s ease`,
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: '16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
  },
  '&.unread': {
    backgroundColor: `${theme.palette.primary.main}08`,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
}));

const NotificationChip = styled(Chip)(() => ({
  fontSize: '0.7rem',
  height: '20px',
  fontWeight: 500,
}));

interface Notification {
  id: string;
  type: 'assessment' | 'career' | 'achievement' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'assessment',
    title: 'Assessment Complete',
    message: 'Your career assessment results are ready to view',
    time: '2 hours ago',
    read: false,
    icon: <AssessmentIcon />,
    color: '#4CAF50',
  },
  {
    id: '2',
    type: 'career',
    title: 'New Career Path',
    message: 'Based on your profile, Software Engineering is a great match',
    time: '5 hours ago',
    read: false,
    icon: <WorkIcon />,
    color: '#2196F3',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You completed your first learning module!',
    time: '1 day ago',
    read: true,
    icon: <StarIcon />,
    color: '#FF9800',
  },
  {
    id: '4',
    type: 'system',
    title: 'Weekly Progress Report',
    message: 'Your weekly learning progress is now available',
    time: '2 days ago',
    read: true,
    icon: <TrendingUpIcon />,
    color: '#9C27B0',
  },
];

const NotificationPanel = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assessment': return '#4CAF50';
      case 'career': return '#2196F3';
      case 'achievement': return '#FF9800';
      case 'system': return '#9C27B0';
      default: return theme.palette.primary.main;
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ 
          color: 'text.primary',
          position: 'relative',
        }}
      >
        <Badge badgeContent={unreadCount} color="primary" max={9}>
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <NotificationPaper>
              {/* Header */}
              <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notifications
                  </Typography>
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {unreadCount} unread notifications
                  </Typography>
                  {unreadCount > 0 && (
                    <Button size="small" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Notifications List */}
              <Box sx={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No notifications yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We'll notify you when there's something new
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    <AnimatePresence>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <NotificationItem 
                            className={!notification.read ? 'unread' : ''}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <ListItemAvatar>
                              <Avatar 
                                sx={{ 
                                  bgcolor: `${notification.color}20`,
                                  color: notification.color,
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {notification.icon}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: !notification.read ? 600 : 500 }}>
                                  {notification.title}
                                </Typography>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {notification.message}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {notification.time}
                                    </Typography>
                                    <NotificationChip
                                      label={notification.type}
                                      size="small"
                                      sx={{
                                        bgcolor: `${getTypeColor(notification.type)}20`,
                                        color: getTypeColor(notification.type),
                                      }}
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                                sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </NotificationItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                )}
              </Box>

              {/* Footer */}
              {notifications.length > 0 && (
                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Button variant="text" fullWidth>
                    View all notifications
                  </Button>
                </Box>
              )}
            </NotificationPaper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationPanel;
