import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '32px 24px',
}));

const stats = [
  { value: '85%', label: 'Of students feel unsure about their exact career path.' },
  { value: '60%', label: 'Of graduates end up in fields entirely unrelated to their degree.' },
  { value: '1', label: 'AI Platform needed to bridge the gap and guide you to success.' },
];

const ProblemStats = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'transparent', position: 'relative', zIndex: 2 }}>
      <Container maxWidth="lg">
        <Grid container>
          {stats.map((stat, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={index}
              sx={{ 
                borderRight: { md: index !== 2 ? '1px solid #EAEAEA' : 'none' },
                borderBottom: { xs: index !== 2 ? '1px solid #EAEAEA' : 'none', md: 'none' }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StatBox>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: '#462872', mb: 2, fontSize: { xs: '3rem', md: '4rem' } }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4B5563', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </StatBox>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
export default ProblemStats;
