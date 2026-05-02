import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  People,
  School,
  ArrowForward,
  PlayArrow,
  Star,
  Psychology,
  Work,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled Components
const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  background: `linear-gradient(180deg, 
    #ffffff 0%, 
    #f8f6ff 30%,
    #f0ebff 60%,
    #e8e3f6 100%)`,
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 80% 20%, ${alpha('#462872', 0.08)} 0%, transparent 50%),
                  radial-gradient(circle at 20% 80%, ${alpha('#3b2260', 0.06)} 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, ${alpha('#e8e3f6', 0.5)} 0%, transparent 70%)`,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23462872' fill-opacity='0.1' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    pointerEvents: 'none',
  },
}));

const FloatingShape = styled(Box)<{ delay: number; size: number }>(({ delay, size }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: `linear-gradient(135deg, 
    ${alpha('#462872', 0.08)}, 
    ${alpha('#e8e3f6', 0.15)}, 
    ${alpha('#ffffff', 0.2)})`,
  animation: `float ${8 + delay}s ease-in-out infinite, pulse ${4 + delay}s ease-in-out infinite`,
  boxShadow: `0 0 ${size/4}px ${alpha('#462872', 0.1)}, inset 0 0 ${size/8}px ${alpha('#ffffff', 0.3)}`,
  '@keyframes float': {
    '0%, 100%': { 
      transform: `translateY(0px) translateX(0px) rotate(0deg) scale(1)` 
    },
    '25%': { 
      transform: `translateY(-${size/8}px) translateX(${size/12}px) rotate(90deg) scale(1.05)` 
    },
    '50%': { 
      transform: `translateY(-${size/4}px) translateX(0px) rotate(180deg) scale(1)` 
    },
    '75%': { 
      transform: `translateY(-${size/8}px) translateX(-${size/12}px) rotate(270deg) scale(0.95)` 
    },
  },
  '@keyframes pulse': {
    '0%, 100%': { opacity: 0.2 },
    '50%': { opacity: 0.4 },
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: 'white',
  border: `1px solid ${alpha('#462872', 0.1)}`,
  borderRadius: '20px',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(70, 40, 114, 0.08)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #462872, #3b2260)',
    transform: 'scaleX(0)',
    transition: 'transform 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(70, 40, 114, 0.15), 0 0 0 1px rgba(70, 40, 114, 0.1)',
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: 'white',
  border: `1px solid ${alpha('#462872', 0.1)}`,
  borderRadius: '24px',
  padding: theme.spacing(4),
  height: '100%',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(70, 40, 114, 0.08)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #462872, #3b2260)',
    transform: 'scaleX(0)',
    transition: 'transform 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.03)',
    boxShadow: '0 25px 50px rgba(70, 40, 114, 0.15), 0 0 0 1px rgba(70, 40, 114, 0.1)',
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #462872, #3b2260)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}));

const ModernButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #462872, #3b2260)',
  color: 'white',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(70, 40, 114, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #3b2260, #2e1a4d)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(70, 40, 114, 0.4)',
  },
}));

const SecondaryModernButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: 'white',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  padding: '14px 32px',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: 'translateY(-2px)',
  },
}));

const ModernHero = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: '10K+', label: 'Active Users', icon: <People /> },
    { number: '95%', label: 'Success Rate', icon: <TrendingUp /> },
    { number: '500+', label: 'Career Paths', icon: <School /> },
    { number: '4.9', label: 'User Rating', icon: <Star /> },
  ];

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Guidance',
      description: 'Get personalized career recommendations powered by advanced machine learning algorithms.',
    },
    {
      icon: <Work sx={{ fontSize: 40 }} />,
      title: 'Fast-Track Learning',
      description: 'Accelerate your career growth with optimized learning paths and skill development.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Industry Insights',
      description: 'Stay ahead with real-time market trends, salary data, and in-demand skills.',
    },
  ];

  return (
    <HeroContainer>
      {/* Floating Background Elements */}
      <FloatingShape
        sx={{ width: 400, height: 400, top: '5%', left: '5%', opacity: 0.4 }}
        delay={0}
        size={400}
      />
      <FloatingShape
        sx={{ width: 250, height: 250, top: '50%', right: '10%', opacity: 0.3 }}
        delay={2}
        size={250}
      />
      <FloatingShape
        sx={{ width: 180, height: 180, bottom: '15%', left: '15%', opacity: 0.35 }}
        delay={4}
        size={180}
      />
      <FloatingShape
        sx={{ width: 120, height: 120, top: '30%', right: '30%', opacity: 0.25 }}
        delay={6}
        size={120}
      />
      <FloatingShape
        sx={{ width: 300, height: 300, bottom: '10%', right: '5%', opacity: 0.3 }}
        delay={8}
        size={300}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<Star sx={{ color: '#462872' }} />}
                  label="AI-Powered Career Platform"
                  sx={{
                    background: alpha('#462872', 0.1),
                    color: '#462872',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${alpha('#462872', 0.2)}`,
                  }}
                />
              </Box>

              {/* Main Heading */}
              <GradientText
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Transform Your Career with AI
              </GradientText>

              {/* Subheading */}
              <Typography
                variant="h5"
                sx={{
                  color: alpha('#462872', 0.8),
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Discover your perfect career path with personalized AI guidance, 
                skill development, and real-time industry insights.
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 3, mb: 5, flexWrap: 'wrap' }}>
                <ModernButton
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => window.location.href = '/signup'}
                >
                  Get Started Free
                </ModernButton>
                <SecondaryModernButton
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => window.location.href = '/demo'}
                >
                  Watch Demo
                </SecondaryModernButton>
              </Box>

              {/* Trust Indicators */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      sx={{
                        fontSize: 20,
                        color: '#ffd700',
                        mr: 0.5,
                      }}
                    />
                  ))}
                </Box>
                <Typography sx={{ color: alpha('#462872', 0.7), fontSize: '0.9rem' }}>
                  Trusted by 10,000+ professionals
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Content - Stats */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      <StatCard>
                        <Box sx={{ color: '#462872', mb: 2 }}>
                          {stat.icon}
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#462872',
                            fontWeight: 700,
                            mb: 1,
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: alpha('#462872', 0.7),
                            fontSize: '0.9rem',
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </StatCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#462872',
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Everything You Need to Succeed
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha('#462872', 0.7),
                textAlign: 'center',
                mb: 6,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Our comprehensive platform provides all the tools and insights 
              you need to accelerate your career growth.
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  <FeatureCard>
                    <Box sx={{ color: '#462872', mb: 3, display: 'flex', justifyContent: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#462872',
                        fontWeight: 600,
                        mb: 2,
                        textAlign: 'center',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: alpha('#462872', 0.7),
                        textAlign: 'center',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </HeroContainer>
  );
};

export default ModernHero;
