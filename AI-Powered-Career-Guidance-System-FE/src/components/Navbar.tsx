import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuth } from '../hooks/useAuth';


const NavButton = styled(Button)(({ theme }) => ({
  color: '#666',
  padding: '8px 12px',
  fontSize: '0.95rem',
  fontWeight: 500,
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#5E35B1',
  },
  '& .MuiButton-endIcon': {
    marginLeft: 0,
    width: '20px',
    height: '20px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '8px 8px',
    fontSize: '0.9rem',
  },
}));


const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1400px !important',
  padding: '0 64px',
  [theme.breakpoints.down('lg')]: {
    padding: '0 48px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '0 32px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 16px',
  },
}));


const SignUpButton = styled(Button)(() => ({
  backgroundColor: '#462872',
  color: '#fff',
  padding: '8px 24px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#3b2260',
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const displayName = React.useMemo(() => {
    if (!user) return '';
    const first = user.firstName?.trim();
    if (first) return first;
    const email = user.email || '';
    return email.includes('@') ? email.split('@')[0] : email;
  }, [user]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleGoToClassroom = () => {
    navigate('/dashboard/overview');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    try {
      logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        color="transparent" 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid #eee',
          backgroundColor: '#fff',
          top: 0,
          zIndex: 1100,
          pt: 2
        }}
      >
        <StyledContainer>
          <Toolbar disableGutters sx={{ minHeight: '72px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img 
                src="/logos/AiCareerGuidanceLogo.png" 
                alt="AI Career Guidance Logo" 
                style={{ height: '60px', width: 'auto', marginRight: '48px', cursor: 'pointer' }} 
                onClick={handleLogoClick}
              />
              {!isMobile ? (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <NavButton onClick={() => navigate('/')}>Home</NavButton>
                  {user && <NavButton onClick={() => navigate('/dashboard/overview')}>Dashboard</NavButton>}
                  <NavButton onClick={() => navigate('/industry-insights')}>Industry Insights</NavButton>
                  <NavButton onClick={() => navigate('/jobs')}>Jobs</NavButton>
                </Box>
              ) : (
                <IconButton
                  color="inherit"
                  onClick={handleMobileMenuToggle}
                  sx={{ ml: 'auto' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 3, gap: 2 }}>
                {user ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography sx={{ fontSize: '0.95rem', color: '#424446', fontWeight: 500 }}>
                        Hi, {displayName}
                      </Typography>
                      <Avatar 
                        src={`https://i.pravatar.cc/100?u=${encodeURIComponent(user.email)}`}
                        alt={displayName}
                        sx={{ width: 34, height: 34 }}
                      />
                    </Box>
                    <SignUpButton 
                      onClick={handleGoToClassroom}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Go to Classroom
                    </SignUpButton>
                    <Button variant="text" color="inherit" onClick={handleLogout} sx={{ ml: 1 }}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <SignUpButton onClick={handleSignUpClick}>
                    Get Started
                  </SignUpButton>
                )}
              </Box>
            )}
          </Toolbar>
        </StyledContainer>
      </AppBar>

      {/* Spacer */}
      <Toolbar sx={{ minHeight: '80px !important' }} />

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <Box 
          className="fixed left-0 right-0 bg-white shadow-md p-4 z-[1000]"
          sx={{ top: '88px' }}
        >
          <Box className="flex flex-col gap-3">
            <NavButton onClick={() => navigate('/')}>Home</NavButton>
            {user && <NavButton onClick={() => navigate('/dashboard/overview')}>Dashboard</NavButton>}
            <NavButton onClick={() => navigate('/industry-insights')}>Industry Insights</NavButton>
            <NavButton onClick={() => navigate('/jobs')}>Jobs</NavButton>
            
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              {user ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Avatar 
                      src={`https://i.pravatar.cc/100?u=${encodeURIComponent(user.email)}`}
                      alt={displayName}
                      sx={{ width: 36, height: 36 }}
                    />
                    <Typography sx={{ fontSize: '0.95rem', color: '#424446', fontWeight: 500 }}>
                      {displayName}
                    </Typography>
                  </Box>
                  <Button 
                    variant="text" 
                    onClick={handleLogout}
                    fullWidth
                    sx={{ color: '#666', justifyContent: 'flex-start' }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <SignUpButton onClick={handleSignUpClick} fullWidth>
                  Get Started
                </SignUpButton>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navbar;