import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ComingSoon: React.FC = () => {
  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box 
          sx={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(70, 40, 114, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#462872'
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 2 }}>
          Coming Soon
        </Typography>
        <Typography sx={{ color: '#6B7280', fontSize: '1.1rem', mb: 4, lineHeight: 1.6 }}>
          We are working hard to bring you this feature in our next major release. Stay tuned for something amazing!
        </Typography>
        
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, backgroundColor: '#F3F4F6', px: 3, py: 1.5, borderRadius: '20px' }}>
          <ConstructionIcon sx={{ color: '#6B7280', fontSize: 20 }} />
          <Typography sx={{ color: '#4B5563', fontWeight: 500, fontSize: '0.9rem' }}>
            Under Development
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ComingSoon;
