import React from 'react';
import { Box, Container, Typography, Button, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CTAContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#462872',
  borderRadius: '24px',
  padding: '64px 32px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 24px 48px rgba(70, 40, 114, 0.2)',
}));

const GlowOrb = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '400px',
  height: '400px',
  borderRadius: '50%',
  background: `radial-gradient(circle, ${alpha('#818CF8', 0.4)} 0%, transparent 70%)`,
  filter: 'blur(40px)',
  zIndex: 0,
}));

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'transparent', position: 'relative', zIndex: 2 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CTAContainer>
            <GlowOrb sx={{ top: '-200px', left: '-100px' }} />
            <GlowOrb sx={{ bottom: '-200px', right: '-100px', background: `radial-gradient(circle, ${alpha('#C084FC', 0.4)} 0%, transparent 70%)` }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Ready to Accelerate Your Career?
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.8), fontSize: '1.15rem', mb: 6, maxWidth: '600px', mx: 'auto' }}>
                Join thousands of students who have discovered their perfect career path using our intelligent, AI-powered guidance system.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/signup')}
                  endIcon={<ArrowForward />}
                  sx={{ 
                    backgroundColor: '#FFFFFF', 
                    color: '#462872',
                    fontSize: '1.1rem',
                    padding: '14px 32px',
                    fontWeight: 700,
                    '&:hover': { backgroundColor: '#F3F4F6' }
                  }}
                >
                  Take Your Free Assessment
                </Button>
              </Box>
            </Box>
          </CTAContainer>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FinalCTA;
