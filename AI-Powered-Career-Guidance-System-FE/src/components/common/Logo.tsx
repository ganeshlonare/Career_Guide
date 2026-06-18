import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo = ({ size = 'medium', showText = true }: LogoProps) => {
  const sizeMap = {
    small: { icon: 28, text: '1.25rem' },
    medium: { icon: 36, text: '1.5rem' },
    large: { icon: 48, text: '2rem' }
  };

  const dim = sizeMap[size].icon;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: size === 'small' ? 1 : 1.5, cursor: 'pointer' }}>
      {/* Geometric G / Compass shape */}
      <Box sx={{ position: 'relative', width: dim, height: dim }}>
        {/* Outer tilted square */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: size === 'large' ? '12px' : '8px',
            background: `linear-gradient(135deg, #5E35B1 0%, #462872 100%)`,
            transform: 'rotate(45deg)',
            boxShadow: '0 4px 12px rgba(70, 40, 114, 0.2)'
          }}
        />
        {/* Inner white circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '60%',
            height: '60%',
            top: '20%',
            left: '20%',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            zIndex: 1,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        {/* Center accent dot */}
        <Box
          sx={{
            position: 'absolute',
            width: '30%',
            height: '30%',
            top: '35%',
            left: '35%',
            borderRadius: '50%',
            background: `linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)`,
            zIndex: 2,
          }}
        />
      </Box>
      
      {showText && (
        <Typography 
          sx={{ 
            fontWeight: 800, 
            fontSize: sizeMap[size].text,
            letterSpacing: '-0.5px',
            color: '#1F2937',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          CareerAI<Box component="span" sx={{ color: '#FF6B6B' }}>.</Box>
        </Typography>
      )}
    </Box>
  );
};

export default Logo;
