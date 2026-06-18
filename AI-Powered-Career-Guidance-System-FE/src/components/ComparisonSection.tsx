import React from 'react';
import { Box, Container, Typography, Grid, Paper, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Close, Check } from '@mui/icons-material';

const CompareCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'highlight'
})<{ highlight?: boolean }>(({ theme, highlight }) => ({
  padding: '40px',
  borderRadius: '24px',
  backgroundColor: highlight ? alpha('#462872', 0.02) : '#FFFFFF',
  border: `1px solid ${highlight ? alpha('#462872', 0.2) : '#EAEAEA'}`,
  boxShadow: highlight ? '0 12px 40px rgba(70, 40, 114, 0.08)' : '0 4px 24px rgba(0, 0, 0, 0.02)',
  height: '100%',
  position: 'relative',
}));

const ListRow = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '24px',
  '&:last-child': {
    marginBottom: 0,
  }
});

const ComparisonSection = () => {
  return (
    <Box sx={{ pb: { xs: 8, md: 12 }, pt: { xs: 4, md: 6 }, backgroundColor: 'transparent', position: 'relative', zIndex: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1F2937', mb: 3, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            The Old Way vs. The CareerAI Way
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
            Stop relying on generic advice and guesswork. Let data and artificial intelligence pave your precise path.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ height: '100%' }}
            >
              <CompareCard>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#6B7280', mb: 4 }}>
                  Traditional Career Guidance
                </Typography>
                {[
                  'Generic college advice that applies to everyone',
                  'Confusing Google searches with conflicting information',
                  'No clear daily or weekly actionable steps',
                  'Static resumes that don\'t highlight relevant skills',
                  'Overwhelming amounts of uncurated courses'
                ].map((text, i) => (
                  <ListRow key={i}>
                    <Box sx={{ mt: 0.5, p: 0.5, borderRadius: '50%', backgroundColor: alpha('#EF4444', 0.1), display: 'flex' }}>
                      <Close sx={{ color: '#EF4444', fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ color: '#6B7280', fontSize: '1.05rem' }}>{text}</Typography>
                  </ListRow>
                ))}
              </CompareCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <CompareCard highlight>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#462872', mb: 4 }}>
                  The Intelligent Experience
                </Typography>
                {[
                  'Hyper-personalized roadmaps based on your unique data',
                  'Real-time skill matching against current industry demands',
                  'Bite-sized, AI-generated weekly study plans',
                  'Intelligent resume building for specific roles',
                  'Curated, highly-rated resources for exactly what you need'
                ].map((text, i) => (
                  <ListRow key={i}>
                    <Box sx={{ mt: 0.5, p: 0.5, borderRadius: '50%', backgroundColor: alpha('#10B981', 0.1), display: 'flex' }}>
                      <Check sx={{ color: '#10B981', fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ color: '#1F2937', fontWeight: 600, fontSize: '1.05rem' }}>{text}</Typography>
                  </ListRow>
                ))}
              </CompareCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ComparisonSection;
