import React from 'react';
import { Box, Container, alpha, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const ShowcaseContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '600px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '40px',
  marginBottom: '100px',
  perspective: '1000px',
  [theme.breakpoints.down('lg')]: {
    height: 'auto',
    flexDirection: 'column',
    gap: '40px',
    padding: '40px 20px',
    marginBottom: '40px',
  }
}));

const FloatingCard = styled(motion.div)<{ zindex: number }>(({ theme, zindex }) => ({
  position: 'absolute',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: `1px solid ${alpha('#462872', 0.1)}`,
  boxShadow: '0 24px 64px rgba(70, 40, 114, 0.15)',
  overflow: 'hidden',
  zIndex: zindex,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('lg')]: {
    position: 'relative',
    width: '100% !important',
    height: '300px !important',
    transform: 'none !important',
    left: 'auto !important',
    right: 'auto !important',
    top: 'auto !important',
    bottom: 'auto !important',
  }
}));

const CardHeader = styled(Box)({
  padding: '16px 24px',
  borderBottom: '1px solid #EAEAEA',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#FAFAFA'
});

const ProductShowcase = () => {
  return (
    <Box sx={{ position: 'relative', zIndex: 3, overflow: 'hidden' }}>
      <Container maxWidth="xl">
        <ShowcaseContainer>
          
          {/* Left Card: Career Roadmap */}
          <FloatingCard 
            zindex={1}
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            whileInView={{ opacity: 1, x: -350, y: 30, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            style={{ width: '450px', height: '400px' }}
          >
            <CardHeader>
              <Box sx={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: alpha('#462872', 0.1) }} />
              <Typography sx={{ fontWeight: 700, color: '#1F2937' }}>Career Roadmap</Typography>
            </CardHeader>
            <Box sx={{ p: 3, flex: 1, backgroundColor: '#F8F9FA' }}>
              {[1, 2, 3].map((step, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: i === 0 ? '#10B981' : '#E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {i === 0 && <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />}
                    </Box>
                    {i !== 2 && <Box sx={{ width: '2px', height: '40px', backgroundColor: '#E5E7EB', mt: 1 }} />}
                  </Box>
                  <Box sx={{ flex: 1, backgroundColor: '#FFFFFF', p: 2, borderRadius: '12px', border: '1px solid #EAEAEA' }}>
                    <Box sx={{ height: '16px', width: '60%', backgroundColor: '#E5E7EB', borderRadius: '4px', mb: 1 }} />
                    <Box sx={{ height: '12px', width: '90%', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </FloatingCard>

          {/* Right Card: Weekly Plan */}
          <FloatingCard 
            zindex={2}
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            whileInView={{ opacity: 1, x: 350, y: -30, rotate: 10 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
            style={{ width: '400px', height: '450px' }}
          >
            <CardHeader>
              <Box sx={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: alpha('#10B981', 0.1) }} />
              <Typography sx={{ fontWeight: 700, color: '#1F2937' }}>Weekly Plan</Typography>
            </CardHeader>
            <Box sx={{ p: 3, flex: 1, backgroundColor: '#F8F9FA' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                {[1,2,3,4,5,6,7].map(day => (
                  <Box key={day} sx={{ width: '32px', height: '40px', borderRadius: '8px', backgroundColor: day === 3 ? '#462872' : '#E5E7EB', opacity: day === 3 ? 1 : 0.5 }} />
                ))}
              </Box>
              {[1, 2, 3, 4].map(task => (
                <Box key={task} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#FFFFFF', borderRadius: '12px', mb: 2, border: '1px solid #EAEAEA' }}>
                  <Box sx={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${task === 1 ? '#10B981' : '#E5E7EB'}`, backgroundColor: task === 1 ? '#10B981' : 'transparent' }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ height: '14px', width: '70%', backgroundColor: '#E5E7EB', borderRadius: '4px', mb: 0.5 }} />
                    <Box sx={{ height: '10px', width: '40%', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </FloatingCard>

          {/* Center Card: Main Dashboard (Top Layer) */}
          <FloatingCard 
            zindex={3}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
            style={{ width: '650px', height: '480px', boxShadow: '0 32px 80px rgba(70, 40, 114, 0.25)' }}
          >
            <CardHeader sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
                  <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                  <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
                </Box>
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#462872', letterSpacing: '1px' }}>CareerAI Dashboard</Typography>
            </CardHeader>
            <Box sx={{ p: 4, flex: 1, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Profile/Stats Header */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${alpha('#462872', 0.8)}, #462872)` }} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ height: '24px', width: '40%', backgroundColor: '#E5E7EB', borderRadius: '6px', mb: 1.5 }} />
                  <Box sx={{ height: '16px', width: '25%', backgroundColor: '#F3F4F6', borderRadius: '4px' }} />
                </Box>
                <Box sx={{ width: '120px', height: '80px', borderRadius: '16px', backgroundColor: alpha('#10B981', 0.1), border: '1px solid rgba(16, 185, 129, 0.2)' }} />
              </Box>
              
              {/* Main Chart Area */}
              <Box sx={{ flex: 1, backgroundColor: '#F8F9FA', borderRadius: '16px', border: '1px solid #EAEAEA', p: 3, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {[40, 60, 45, 80, 65, 90, 75].map((height, i) => (
                  <Box key={i} sx={{ flex: 1, height: `${height}%`, backgroundColor: i === 5 ? '#462872' : alpha('#462872', 0.2), borderRadius: '8px 8px 0 0' }} />
                ))}
              </Box>

              {/* Bottom Cards */}
              <Box sx={{ display: 'flex', gap: 3, height: '100px' }}>
                <Box sx={{ flex: 1, backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #EAEAEA' }} />
                <Box sx={{ flex: 1, backgroundColor: '#F8F9FA', borderRadius: '12px', border: '1px solid #EAEAEA' }} />
                <Box sx={{ flex: 1, backgroundColor: alpha('#462872', 0.05), borderRadius: '12px', border: `1px dashed ${alpha('#462872', 0.3)}` }} />
              </Box>
            </Box>
          </FloatingCard>

        </ShowcaseContainer>
      </Container>
    </Box>
  );
};
export default ProductShowcase;
