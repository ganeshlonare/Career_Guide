import React, { useState, useEffect, useRef } from 'react';
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
  Menu,
  MenuItem,
  InputBase,
  Paper,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Grow,
  ClickAwayListener,
  List,
  ListItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  BusinessCenter as BusinessCenterIcon,
  Code as CodeIcon,
  Palette as DesignIcon,
  Campaign as MarketingIcon,
  Biotech as ScienceIcon,
  LocalHospital as HealthIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Close as CloseIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import NotificationPanel from './NotificationPanel';

// Animations


// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1400px !important',
  padding: '0 24px',
  [theme.breakpoints.down('lg')]: {
    padding: '0 20px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '0 16px',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: '10px 16px',
  fontSize: '0.95rem',
  fontWeight: 500,
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)',
  },
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  padding: '10px 24px',
  borderRadius: '25px',
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${theme.palette.primary.main}60`,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
  },
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '20px',
  background: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  minWidth: '280px',
  maxWidth: '400px',
  '&:hover, &.focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    background: 'white',
  },
}));

const CategoryChip = styled(Chip)(() => ({
  margin: '4px',
  borderRadius: '20px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
}));

// Navigation data
const careerCategories = [
  { name: 'Technology', icon: <CodeIcon />, color: '#2196F3', path: '/careers/technology' },
  { name: 'Design', icon: <DesignIcon />, color: '#FF9800', path: '/careers/design' },
  { name: 'Business', icon: <BusinessCenterIcon />, color: '#4CAF50', path: '/careers/business' },
  { name: 'Marketing', icon: <MarketingIcon />, color: '#E91E63', path: '/careers/marketing' },
  { name: 'Science', icon: <ScienceIcon />, color: '#9C27B0', path: '/careers/science' },
  { name: 'Healthcare', icon: <HealthIcon />, color: '#00BCD4', path: '/careers/healthcare' },
];

const learningResources = [
  { name: 'Skill Assessment', icon: <AssessmentIcon />, path: '/assessment' },
  { name: 'Career Roadmap', icon: <TrendingUpIcon />, path: '/roadmap' },
  { name: 'Mock Interviews', icon: <PsychologyIcon />, path: '/interviews' },
  { name: 'Resume Builder', icon: <BookIcon />, path: '/resume' },
];

const ModernNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [resourcesAnchor, setResourcesAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const displayName = React.useMemo(() => {
    if (!user) return '';
    const first = user.firstName?.trim();
    if (first) return first;
    const email = user.email || '';
    return email.includes('@') ? email.split('@')[0] : email;
  }, [user]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Navigation handlers
  const handleLogoClick = () => navigate('/');
  const handleSignUpClick = () => navigate('/signup');
  const handleDashboardClick = () => navigate('/dashboard/overview');
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Menu handlers
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryAnchor(event.currentTarget);
  };

  const handleResourcesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setResourcesAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setUserMenuAnchor(null);
    setCategoryAnchor(null);
    setResourcesAnchor(null);
  };

  // Check if route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <StyledAppBar 
        position="fixed" 
        elevation={0}
        sx={{
          transform: scrolled ? 'translateY(0)' : 'translateY(0)',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        }}
      >
        <StyledContainer>
          <Toolbar disableGutters sx={{ minHeight: '80px' }}>
            {/* Logo */}
            <LogoContainer onClick={handleLogoClick}>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <img 
                  src="/logos/AiCareerGuidanceLogo.png" 
                  alt="AI Career Guidance Logo" 
                  style={{ height: '45px', width: 'auto' }}
                />
              </motion.div>
              {!isMobile && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    ml: 2, 
                    fontWeight: 700, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  CareerAI
                </Typography>
              )}
            </LogoContainer>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, gap: 1 }}>
                <NavButton 
                  onClick={handleLogoClick}
                  className={isActiveRoute('/') ? 'active' : ''}
                  startIcon={<HomeIcon />}
                >
                  Home
                </NavButton>
                
                <NavButton 
                  onClick={handleCategoryMenuOpen}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: categoryAnchor ? theme.palette.primary.main : 'inherit' }}
                >
                  Career Paths
                </NavButton>

                <NavButton 
                  onClick={handleResourcesMenuOpen}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ color: resourcesAnchor ? theme.palette.primary.main : 'inherit' }}
                >
                  Resources
                </NavButton>

                <NavButton 
                  onClick={() => navigate('/industry-insights')}
                  className={isActiveRoute('/industry-insights') ? 'active' : ''}
                  startIcon={<TrendingUpIcon />}
                >
                  Insights
                </NavButton>

                <NavButton 
                  onClick={() => navigate('/jobs')}
                  className={isActiveRoute('/jobs') ? 'active' : ''}
                  startIcon={<WorkIcon />}
                >
                  Jobs
                </NavButton>
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
              {/* Search */}
              {!isMobile && (
                <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                  <Box>
                    <SearchContainer 
                      className={searchOpen ? 'focus' : ''}
                      onClick={() => {
                        setSearchOpen(true);
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                      }}
                    >
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      <InputBase
                        placeholder="Search careers, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                        inputRef={searchInputRef}
                        sx={{ flex: 1 }}
                      />
                      {searchOpen && (
                        <IconButton size="small" onClick={() => setSearchOpen(false)}>
                          <CloseIcon />
                        </IconButton>
                      )}
                    </SearchContainer>
                  </Box>
                </ClickAwayListener>
              )}

              {/* Notifications */}
              {!isMobile && user && (
                <NotificationPanel />
              )}

              {/* User Actions */}
              {!isMobile ? (
                user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={handleUserMenuOpen}>
                      <Avatar 
                        src={`https://i.pravatar.cc/100?u=${encodeURIComponent(user.email)}`}
                        alt={displayName}
                        sx={{ width: 36, height: 36, border: `2px solid ${theme.palette.primary.main}` }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'text.primary' }}>
                          {displayName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                          {user.email}
                        </Typography>
                      </Box>
                      <ExpandMoreIcon />
                    </Box>
                    <PrimaryButton onClick={handleDashboardClick}>
                      Dashboard
                    </PrimaryButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="text" onClick={() => navigate('/signin')}>
                      Sign In
                    </Button>
                    <PrimaryButton onClick={handleSignUpClick}>
                      Get Started
                    </PrimaryButton>
                  </Box>
                )
              ) : (
                <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </StyledContainer>
      </StyledAppBar>

      {/* Career Paths Dropdown */}
      <Menu
        anchorEl={categoryAnchor}
        open={Boolean(categoryAnchor)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 280, mt: 1 } }}
        TransitionComponent={Grow}
      >
        <MenuItem disabled sx={{ fontWeight: 600, color: 'text.primary' }}>
          <ListItemIcon><SchoolIcon /></ListItemIcon>
          Explore Career Paths
        </MenuItem>
        <Divider />
        {careerCategories.map((category) => (
          <MenuItem 
            key={category.name}
            onClick={() => {
              navigate(category.path);
              handleMenuClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: category.color }}>
              {category.icon}
            </ListItemIcon>
            <ListItemText primary={category.name} />
            <CategoryChip 
              label="Popular" 
              size="small" 
              sx={{ 
                bgcolor: `${category.color}20`, 
                color: category.color,
                fontSize: '0.7rem'
              }} 
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Resources Dropdown */}
      <Menu
        anchorEl={resourcesAnchor}
        open={Boolean(resourcesAnchor)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 250, mt: 1 } }}
        TransitionComponent={Grow}
      >
        <MenuItem disabled sx={{ fontWeight: 600, color: 'text.primary' }}>
          <ListItemIcon><BookIcon /></ListItemIcon>
          Learning Resources
        </MenuItem>
        <Divider />
        {learningResources.map((resource) => (
          <MenuItem 
            key={resource.name}
            onClick={() => {
              navigate(resource.path);
              handleMenuClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              {resource.icon}
            </ListItemIcon>
            <ListItemText primary={resource.name} />
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 220, mt: 1 } }}
        TransitionComponent={Grow}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
          <ListItemIcon><PersonIcon /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/dashboard/overview'); handleMenuClose(); }}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          Dashboard
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'white',
              zIndex: 1200,
              overflowY: 'auto',
            }}
          >
            <Box sx={{ p: 3 }}>
              {/* Mobile Search */}
              <SearchContainer sx={{ mb: 3, width: '100%' }}>
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  placeholder="Search careers, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flex: 1 }}
                />
              </SearchContainer>

              {/* Mobile Navigation */}
              <List>
                <ListItem button onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => { setMobileMenuOpen(false); }}>
                  <ListItemIcon><SchoolIcon /></ListItemIcon>
                  <ListItemText primary="Career Paths" />
                </ListItem>
                <ListItem button onClick={() => { setMobileMenuOpen(false); }}>
                  <ListItemIcon><BookIcon /></ListItemIcon>
                  <ListItemText primary="Resources" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/industry-insights'); setMobileMenuOpen(false); }}>
                  <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                  <ListItemText primary="Industry Insights" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/jobs'); setMobileMenuOpen(false); }}>
                  <ListItemIcon><WorkIcon /></ListItemIcon>
                  <ListItemText primary="Jobs" />
                </ListItem>
              </List>

              {/* Mobile User Section */}
              {user && (
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={`https://i.pravatar.cc/100?u=${encodeURIComponent(user.email)}`}
                      alt={displayName}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{displayName}</Typography>
                      <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <PrimaryButton onClick={handleDashboardClick} fullWidth sx={{ mb: 2 }}>
                    Go to Dashboard
                  </PrimaryButton>
                  <Button variant="text" onClick={handleLogout} fullWidth>
                    Logout
                  </Button>
                </Box>
              )}

              {/* Mobile Auth */}
              {!user && (
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid' }}>
                  <Button variant="text" onClick={() => { navigate('/signin'); setMobileMenuOpen(false); }} fullWidth sx={{ mb: 2 }}>
                    Sign In
                  </Button>
                  <PrimaryButton onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} fullWidth>
                    Get Started
                  </PrimaryButton>
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1199,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Spacer */}
      <Toolbar sx={{ minHeight: '80px !important' }} />
    </>
  );
};

export default ModernNavbar;
