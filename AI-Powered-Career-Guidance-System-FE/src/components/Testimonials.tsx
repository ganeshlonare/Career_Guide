import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { FormatQuote, Star } from '@mui/icons-material';

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: '32px',
  borderRadius: '20px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #EAEAEA',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)',
  height: '100%',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(70, 40, 114, 0.08)',
    borderColor: alpha('#462872', 0.2),
  }
}));

const QuoteIcon = styled(FormatQuote)(({ theme }) => ({
  position: 'absolute',
  top: '24px',
  right: '24px',
  fontSize: '48px',
  color: alpha('#462872', 0.08),
}));

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Recent CS Graduate',
    content: 'The AI roadmap completely changed my approach. Instead of blindly applying, I followed the weekly plan, built the recommended projects, and landed a great SDE role within 3 months!',
    avatar: 'P'
  },
  {
    name: 'Rahul Verma',
    role: 'Transitioning to Data Science',
    content: 'I was overwhelmed by what to learn next. The AI assessment pinpointed exactly what skills I was missing and gave me a crystal clear, step-by-step path to follow.',
    avatar: 'R'
  },
  {
    name: 'Anjali Desai',
    role: 'Final Year Student',
    content: 'The weekly preparation plans are a game changer. It breaks down huge goals into small, manageable daily tasks so I never feel lost or demotivated.',
    avatar: 'A'
  }
];

const Testimonials = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'transparent', position: 'relative', zIndex: 2 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1F2937', mb: 3, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Success Stories
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
            See how our AI mentor has helped thousands of students discover their path and achieve their dream roles.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((t, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                style={{ height: '100%' }}
              >
                <TestimonialCard>
                  <QuoteIcon />
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} sx={{ color: '#F59E0B', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.8, mb: 4, fontStyle: 'italic', fontSize: '1.05rem' }}>
                    "{t.content}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#462872', width: 48, height: 48, fontWeight: 600 }}>
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '1rem', lineHeight: 1.2 }}>
                        {t.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {t.role}
                      </Typography>
                    </Box>
                  </Box>
                </TestimonialCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;
