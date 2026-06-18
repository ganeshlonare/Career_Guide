import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Switch, Divider, Button, TextField, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';

const SettingsSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  border: '1px solid rgba(70, 40, 114, 0.1)',
  boxShadow: '0 4px 12px rgba(70, 40, 114, 0.02)',
  backgroundColor: '#fff',
  marginBottom: theme.spacing(4),
}));

const SettingRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 0',
});

const Settings = () => {
  const { user } = useAuth();
  
  const displayName = React.useMemo(() => {
    if (!user) return 'User';
    const first = user.firstName?.trim();
    const last = user.lastName?.trim();
    if (first || last) return [first, last].filter(Boolean).join(' ');
    const email = user.email || '';
    return email.includes('@') ? email.split('@')[0] : email;
  }, [user]);

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    weeklyDigest: true,
    mentorMessages: true,
    newFeatures: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Manage your account preferences and configurations.
        </Typography>
      </Box>

      {/* Account Settings */}
      <SettingsSection>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
          Account Information
        </Typography>
        

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              defaultValue={displayName}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              defaultValue={user?.email || ''}
              variant="outlined"
              size="small"
              disabled
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" sx={{ backgroundColor: '#462872', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#3a2160' } }}>
            Save Changes
          </Button>
        </Box>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
          Notifications
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          Choose what updates you want to receive.
        </Typography>

        <SettingRow>
          <Box>
            <Typography sx={{ fontWeight: 500, color: '#333' }}>Email Updates</Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>Receive daily summaries of your progress.</Typography>
          </Box>
          <Switch 
            checked={notifications.emailUpdates} 
            onChange={() => handleToggle('emailUpdates')} 
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#462872' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#462872' } }} 
          />
        </SettingRow>
        <Divider />
        
        <SettingRow>
          <Box>
            <Typography sx={{ fontWeight: 500, color: '#333' }}>Weekly Digest</Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>A comprehensive review of your weekly milestones.</Typography>
          </Box>
          <Switch 
            checked={notifications.weeklyDigest} 
            onChange={() => handleToggle('weeklyDigest')} 
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#462872' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#462872' } }} 
          />
        </SettingRow>
        <Divider />

        <SettingRow>
          <Box>
            <Typography sx={{ fontWeight: 500, color: '#333' }}>Mentor Messages</Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>Get notified when a mentor replies to you.</Typography>
          </Box>
          <Switch 
            checked={notifications.mentorMessages} 
            onChange={() => handleToggle('mentorMessages')} 
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#462872' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#462872' } }} 
          />
        </SettingRow>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection sx={{ border: '1px solid rgba(220, 38, 38, 0.2)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#dc2626', mb: 1 }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          Irreversible actions related to your account.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontWeight: 500, color: '#333' }}>Delete Account</Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>Permanently remove your account and all data.</Typography>
          </Box>
          <Button variant="outlined" color="error" sx={{ textTransform: 'none', borderRadius: '8px' }}>
            Delete Account
          </Button>
        </Box>
      </SettingsSection>
    </Box>
  );
};

export default Settings;
