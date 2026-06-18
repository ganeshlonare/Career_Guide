import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, alpha, Chip } from '@mui/material';
import {
  AutoAwesome,
  Timeline,
  School,
  Assignment,
  ArrowForward,
  CheckCircleOutline
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  paddingTop: '50px',
  paddingBottom: '50px',
  fontFamily: '"Inter", sans-serif',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 28px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(70, 40, 114, 0.2)',
  },
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: '28px',
  borderRadius: '16px',
  border: '1px solid #EAEAEA',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
  backgroundColor: '#FFFFFF',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: alpha('#462872', 0.3),
    boxShadow: '0 12px 32px rgba(70, 40, 114, 0.08)',
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha('#462872', 0.06),
  color: '#462872',
  marginBottom: '8px'
}));

const BackgroundGraphics = () => (
  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {/* Blurred Gradient Orb 1 */}
    <Box
      sx={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#462872', 0.08)} 0%, ${alpha('#462872', 0)} 70%)`,
        filter: 'blur(60px)',
        animation: 'float 20s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-30px, 30px)' },
        }
      }}
    />

    {/* Blurred Gradient Orb 2 */}
    <Box
      sx={{
        position: 'absolute',
        bottom: '0%',
        left: '-10%',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha('#818CF8', 0.06)} 0%, ${alpha('#818CF8', 0)} 70%)`,
        filter: 'blur(80px)',
        animation: 'float-reverse 25s ease-in-out infinite',
        '@keyframes float-reverse': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' },
        }
      }}
    />

    {/* Removed gradient overlay for seamless blending */}
  </Box>
);

const ModernHero = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 28 }} />,
      title: 'AI Career Assessment',
      description: 'Discover your strengths and get tailored career recommendations based on your unique profile.'
    },
    {
      icon: <Timeline sx={{ fontSize: 28 }} />,
      title: 'Personalized Roadmaps',
      description: 'Follow step-by-step, dynamic career paths designed specifically for your dream role.'
    },
    {
      icon: <Assignment sx={{ fontSize: 28 }} />,
      title: 'Weekly Action Plans',
      description: 'Stay on track with AI-generated weekly study plans and skill-building milestones.'
    },
    {
      icon: <School sx={{ fontSize: 28 }} />,
      title: 'Job Assistance & Prep',
      description: 'Ace your interviews and build professional resumes with intelligent guidance.'
    }
  ];

  return (
    <PageWrapper>
      <BackgroundGraphics />
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">

          {/* Left Side: Text & CTA */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Chip
                label="India's First AI-Powered Career Mentor"
                icon={<AutoAwesome sx={{ fontSize: '16px !important' }} />}
                sx={{
                  backgroundColor: alpha('#462872', 0.08),
                  color: '#462872',
                  fontWeight: 600,
                  px: 1,
                  mb: 4,
                  border: `1px solid ${alpha('#462872', 0.2)}`
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  color: '#1F2937',
                  lineHeight: 1.15,
                  mb: 3,
                  letterSpacing: '-0.02em'
                }}
              >
                Transform Your Future with <Box component="span" sx={{ color: '#462872' }}>Intelligent</Box> Career Guidance
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#4B5563',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 5,
                  maxWidth: '90%'
                }}
              >
                Navigate your professional journey with confidence. Get personalized AI assessments, actionable roadmaps, and tailored weekly plans to help you land your dream job and achieve your career goals.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 6 }}>
                <StyledButton
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    backgroundColor: '#462872',
                    color: 'white',
                    '&:hover': { backgroundColor: '#3b2260' }
                  }}
                  endIcon={<ArrowForward />}
                >
                  Start Your Journey
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={() => navigate('/dashboard/overview')}
                  sx={{
                    borderColor: '#462872',
                    color: '#462872',
                    borderWidth: '2px',
                    '&:hover': { borderWidth: '2px', borderColor: '#3b2260', backgroundColor: alpha('#462872', 0.04) }
                  }}
                >
                  Explore Dashboard
                </StyledButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, color: '#6B7280', fontSize: '0.9rem', fontWeight: 500 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutline sx={{ color: '#10B981', fontSize: 20 }} /> Free Registration
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutline sx={{ color: '#10B981', fontSize: 20 }} /> Expert Mentorship
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side: Features Grid */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                    style={{ height: '100%' }}
                  >
                    <FeatureCard>
                      <IconWrapper>
                        {feature.icon}
                      </IconWrapper>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1.1rem' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        {feature.description}
                      </Typography>
                    </FeatureCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>

      </Container>
    </PageWrapper>
  );
};

export default ModernHero;
