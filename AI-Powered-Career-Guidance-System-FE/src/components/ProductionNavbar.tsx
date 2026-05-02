import React, { useState, useEffect } from 'react';
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
  Badge,
  InputBase,
  Paper,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Grow,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as ArrowDropDownIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  BusinessCenter as BusinessCenterIcon,
  Computer as CodeIcon,
  Brush as DesignIcon,
  Announcement as MarketingIcon,
  Science as ScienceIcon,
  MedicalServices as HealthIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  People as TeamIcon,
  Star as TestimonialIcon,
  Article as BlogIcon,
  PlayArrow as VideoIcon,
  Mic as PodcastIcon,
  Download as DownloadIcon,
  HelpOutline as HelpIcon,
  Security as SecurityIcon,
  FastForward as SpeedIcon,
  Timeline as RoadmapIcon,
  Star as AchievementIcon,
} from '@mui/icons-material';
// Production Navbar - Fixed all icon issues
import { styled } from '@mui/material/styles';

const SecondaryButton = styled(Button)({
  color: '#462872',
  borderColor: '#462872',
  borderWidth: '1.5px',
  borderStyle: 'solid',
  padding: '8px 24px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: 'transparent',
  minWidth: '100px',
  whiteSpace: 'nowrap',
  minHeight: '36px',
  '&:hover': {
    borderColor: '#3b2260',
    color: '#3b2260',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(70, 40, 114, 0.15)',
  },
});
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import NotificationPanel from './NotificationPanel';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    background: 'rgba(255, 255, 255, 0.98)',
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
    transform: 'scale(1.02)',
  },
}));

const NavButton = styled(Button)({
  color: 'rgb(31, 41, 55)',
  padding: '8px 16px',
  fontSize: '0.9rem',
  fontWeight: 500,
  borderRadius: '6px',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  backgroundColor: 'transparent',
  minHeight: '36px',
  '&:hover': {
    backgroundColor: 'rgb(243, 244, 246)',
    color: '#462872',
  },
  '&.active': {
    backgroundColor: '#462872',
    color: 'white',
  },
});

const PrimaryButton = styled(Button)({
  backgroundColor: '#462872',
  color: 'white',
  padding: '8px 28px',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  minWidth: '120px',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px rgba(70, 40, 114, 0.15)',
  minHeight: '36px',
  '&:hover': {
    backgroundColor: '#3b2260',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(70, 40, 114, 0.25)',
  },
});

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '24px',
  background: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  minWidth: '300px',
  maxWidth: '450px',
  '&:hover, &.focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    background: 'white',
  },
}));

const DropdownMenu = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  minWidth: '220px',
  mt: 1,
}));

// Navigation Data Structure
const navigationStructure = {
  products: {
    title: 'Products',
    icon: <SchoolIcon />,
    items: [
      {
        title: 'Career Assessment',
        description: 'Discover your perfect career path',
        icon: <AchievementIcon />,
        path: '/assessment',
        badge: 'Popular'
      },
      {
        title: 'Skill Development',
        description: 'Build in-demand skills',
        icon: <TrendingUpIcon />,
        path: '/skills'
      },
      {
        title: 'Interview Prep',
        description: 'Ace your interviews',
        icon: <PsychologyIcon />,
        path: '/interviews'
      },
      {
        title: 'Resume Builder',
        description: 'Create professional resumes',
        icon: <BookIcon />,
        path: '/resume'
      }
    ]
  },
  industries: {
    title: 'Industries',
    icon: <BusinessCenterIcon />,
    items: [
      {
        title: 'Technology',
        description: 'Software & IT careers',
        icon: <CodeIcon />,
        path: '/careers/technology',
        color: '#2196F3'
      },
      {
        title: 'Design',
        description: 'Creative & design roles',
        icon: <DesignIcon />,
        path: '/careers/design',
        color: '#FF9800'
      },
      {
        title: 'Business',
        description: 'Management & consulting',
        icon: <BusinessCenterIcon />,
        path: '/careers/business',
        color: '#4CAF50'
      },
      {
        title: 'Marketing',
        description: 'Digital marketing & sales',
        icon: <MarketingIcon />,
        path: '/careers/marketing',
        color: '#E91E63'
      },
      {
        title: 'Healthcare',
        description: 'Medical & wellness careers',
        icon: <HealthIcon />,
        path: '/careers/healthcare',
        color: '#00BCD4'
      },
      {
        title: 'Science',
        description: 'Research & development',
        icon: <ScienceIcon />,
        path: '/careers/science',
        color: '#9C27B0'
      }
    ]
  },
  resources: {
    title: 'Resources',
    icon: <BookIcon />,
    items: [
      {
        title: 'Blog',
        description: 'Career tips & insights',
        icon: <BlogIcon />,
        path: '/blog'
      },
      {
        title: 'Videos',
        description: 'Educational content',
        icon: <VideoIcon />,
        path: '/videos'
      },
      {
        title: 'Podcasts',
        description: 'Industry discussions',
        icon: <PodcastIcon />,
        path: '/podcasts'
      },
      {
        title: 'Downloads',
        description: 'Free resources & templates',
        icon: <DownloadIcon />,
        path: '/downloads'
      }
    ]
  },
  company: {
    title: 'Company',
    icon: <InfoIcon />,
    items: [
      {
        title: 'About Us',
        description: 'Our mission & story',
        icon: <InfoIcon />,
        path: '/about'
      },
      {
        title: 'Team',
        description: 'Meet our experts',
        icon: <TeamIcon />,
        path: '/team'
      },
      {
        title: 'Careers',
        description: 'Join our team',
        icon: <WorkIcon />,
        path: '/company-careers'
      },
      {
        title: 'Contact',
        description: 'Get in touch',
        icon: <ContactIcon />,
        path: '/contact'
      }
    ]
  }
};

const ProductionNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [productAnchor, setProductAnchor] = useState<null | HTMLElement>(null);
  const [industryAnchor, setIndustryAnchor] = useState<null | HTMLElement>(null);
  const [resourceAnchor, setResourceAnchor] = useState<null | HTMLElement>(null);
  const [companyAnchor, setCompanyAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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

  const handleMenuClose = () => {
    setUserMenuAnchor(null);
    setProductAnchor(null);
    setIndustryAnchor(null);
    setResourceAnchor(null);
    setCompanyAnchor(null);
  };

  // Check if route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Render dropdown menu
  const renderDropdownMenu = (anchor: HTMLElement | null, menuData: any, onClose: () => void) => {
    const open = Boolean(anchor);
    
    return (
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={onClose}
        PaperProps={{ 
          sx: { 
            minWidth: 280, 
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          } 
        }}
        TransitionComponent={Grow}
      >
        <MenuItem disabled sx={{ fontWeight: 600, color: 'text.primary', py: 2 }}>
          <ListItemIcon>{menuData.icon}</ListItemIcon>
          <ListItemText primary={menuData.title} />
        </MenuItem>
        <Divider />
        {menuData.items.map((item: any, index: number) => (
          <MenuItem 
            key={index}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: item.color || theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.title}
              secondary={item.description}
              primaryTypographyProps={{ fontWeight: 500 }}
              secondaryTypographyProps={{ fontSize: '0.85rem' }}
            />
            {item.badge && (
              <Chip 
                label={item.badge} 
                size="small" 
                sx={{ 
                  ml: 1,
                  bgcolor: `${theme.palette.primary.main}20`, 
                  color: theme.palette.primary.main,
                  fontSize: '0.7rem',
                  height: '20px'
                }} 
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    );
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
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, gap: 0.5 }}>
                <NavButton 
                  onClick={handleLogoClick}
                  className={isActiveRoute('/') ? 'active' : ''}
                  startIcon={<HomeIcon />}
                >
                  Home
                </NavButton>
                
                <NavButton 
                  onClick={(e) => setProductAnchor(productAnchor ? null : e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Products
                </NavButton>

                <NavButton 
                  onClick={(e) => setIndustryAnchor(industryAnchor ? null : e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Industries
                </NavButton>

                <NavButton 
                  onClick={(e) => setResourceAnchor(resourceAnchor ? null : e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
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

                <NavButton 
                  onClick={(e) => setCompanyAnchor(companyAnchor ? null : e.currentTarget)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Company
                </NavButton>
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 2 }}>
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
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <SecondaryButton onClick={() => navigate('/signin')}>
                      Sign In
                    </SecondaryButton>
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

      {/* Dropdown Menus */}
      {renderDropdownMenu(productAnchor, navigationStructure.products, () => setProductAnchor(null))}
      {renderDropdownMenu(industryAnchor, navigationStructure.industries, () => setIndustryAnchor(null))}
      {renderDropdownMenu(resourceAnchor, navigationStructure.resources, () => setResourceAnchor(null))}
      {renderDropdownMenu(companyAnchor, navigationStructure.company, () => setCompanyAnchor(null))}

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

              {/* Mobile Navigation with Accordions */}
              <List sx={{ p: 0 }}>
                <ListItem button onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>

                {/* Products Accordion */}
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <ListItemIcon><SchoolIcon /></ListItemIcon>
                    <ListItemText primary="Products" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pl: 4 }}>
                    <List sx={{ p: 0 }}>
                      {navigationStructure.products.items.map((item: any, index: number) => (
                        <ListItem 
                          key={index}
                          button 
                          onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                          sx={{ pl: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.title} secondary={item.description} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Industries Accordion */}
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <ListItemIcon><BusinessCenterIcon /></ListItemIcon>
                    <ListItemText primary="Industries" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pl: 4 }}>
                    <List sx={{ p: 0 }}>
                      {navigationStructure.industries.items.map((item: any, index: number) => (
                        <ListItem 
                          key={index}
                          button 
                          onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                          sx={{ pl: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32, color: item.color }}>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.title} secondary={item.description} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                {/* Resources Accordion */}
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <ListItemIcon><BookIcon /></ListItemIcon>
                    <ListItemText primary="Resources" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pl: 4 }}>
                    <List sx={{ p: 0 }}>
                      {navigationStructure.resources.items.map((item: any, index: number) => (
                        <ListItem 
                          key={index}
                          button 
                          onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                          sx={{ pl: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.title} secondary={item.description} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <ListItem button onClick={() => { navigate('/industry-insights'); setMobileMenuOpen(false); }}>
                  <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                  <ListItemText primary="Industry Insights" />
                </ListItem>

                <ListItem button onClick={() => { navigate('/jobs'); setMobileMenuOpen(false); }}>
                  <ListItemIcon><WorkIcon /></ListItemIcon>
                  <ListItemText primary="Jobs" />
                </ListItem>

                {/* Company Accordion */}
                <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Company" />
                  </AccordionSummary>
                  <AccordionDetails sx={{ pl: 4 }}>
                    <List sx={{ p: 0 }}>
                      {navigationStructure.company.items.map((item: any, index: number) => (
                        <ListItem 
                          key={index}
                          button 
                          onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                          sx={{ pl: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.title} secondary={item.description} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
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
                  <SecondaryButton onClick={() => { navigate('/signin'); setMobileMenuOpen(false); }} fullWidth sx={{ mb: 2 }}>
                    Sign In
                  </SecondaryButton>
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

export default ProductionNavbar;
