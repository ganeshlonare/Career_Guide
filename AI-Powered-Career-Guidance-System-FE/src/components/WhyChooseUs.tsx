import React from 'react';
import { Box, Container, Typography, Grid, Paper, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { TrendingUp, Psychology, AssignmentTurnedIn } from '@mui/icons-material';

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: '40px 32px',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #EAEAEA',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)',
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(70, 40, 114, 0.08)',
    borderColor: alpha('#462872', 0.2),
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha('#462872', 0.08),
  color: '#462872',
  marginBottom: '24px'
}));

const features = [
  {
    title: 'Driven by Real-Time Market Data',
    description: 'Our AI doesn\'t rely on outdated advice. It constantly analyzes thousands of current job postings to ensure the skills you learn are exactly what top employers are hiring for today.',
    icon: <TrendingUp sx={{ fontSize: 32 }} />
  },
  {
    title: 'Hyper-Personalized Intelligence',
    description: 'No two roadmaps are the same. We evaluate your unique strengths, weaknesses, and cultural fit to generate a trajectory that is 100% custom-tailored to your specific goals.',
    icon: <Psychology sx={{ fontSize: 32 }} />
  },
  {
    title: 'From Planning to Execution',
    description: 'We don\'t just hand you a generic 6-month plan. We break your massive career goals down into bite-sized, actionable weekly tasks so you never feel overwhelmed.',
    icon: <AssignmentTurnedIn sx={{ fontSize: 32 }} />
  }
];

const WhyChooseUs = () => {
  return (
    <Box sx={{ pb: { xs: 8, md: 12 }, pt: { xs: 4, md: 6 }, backgroundColor: 'transparent', position: 'relative', zIndex: 2 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1F2937', mb: 3, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Why Choose Our AI Mentor?
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '700px', mx: 'auto' }}>
            We bridge the gap between education and employment by providing the most intelligent, data-backed career guidance available.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((f, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                style={{ height: '100%' }}
              >
                <FeatureCard>
                  <IconWrapper>
                    {f.icon}
                  </IconWrapper>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1F2937', mb: 2, fontSize: '1.25rem' }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.7 }}>
                    {f.description}
                  </Typography>
                </FeatureCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
