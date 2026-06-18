import React from 'react';
import { Box, Container, Typography, Grid, alpha, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Search, Description, Work, Person, CalendarMonth, Assignment } from '@mui/icons-material';

const TimelineContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: '40px 0 40px 0',
  position: 'relative',
  overflow: 'hidden',
}));

const CenterLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: 0,
  bottom: 0,
  width: '1px',
  backgroundColor: alpha('#462872', 0.15),
  transform: 'translateX(-50%)',
  [theme.breakpoints.down('md')]: {
    left: '24px',
  }
}));

const StyledChip = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: '6px 20px',
  borderRadius: '24px',
  backgroundColor: 'transparent',
  border: `1px solid ${alpha('#462872', 0.3)}`,
  color: '#462872',
  fontSize: '0.85rem',
  fontWeight: 600,
  marginBottom: '24px',
}));

const ContentBlock = styled(Box)({
  padding: '24px',
  position: 'relative',
  zIndex: 2,
});

const BulletList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: '12px',
  marginTop: '32px',
});

const BulletItem = styled('li')({
  position: 'relative',
  paddingLeft: '20px',
  color: '#6B7280',
  fontSize: '0.95rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#462872',
  }
});

const IconContainerWrapper = styled(Box)({
  position: 'relative',
  width: '240px',
  height: '240px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  zIndex: 2,
});

const OuterCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '180px',
  height: '180px',
  borderRadius: '50%',
  border: `1px solid ${alpha('#462872', 0.15)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha('#462872', 0.02),
}));

const InnerCircle = styled(Box)(({ theme }) => ({
  width: '110px',
  height: '110px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF',
  boxShadow: '0 8px 32px rgba(70, 40, 114, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#462872',
  zIndex: 2,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const StepBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '25px',
  right: '25px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF',
  border: `2px solid ${alpha('#462872', 0.15)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  color: '#462872',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  zIndex: 3,
}));

const HugeNumber = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  fontSize: '220px',
  fontWeight: 900,
  color: alpha('#462872', 0.04),
  lineHeight: 1,
  zIndex: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
}));

const steps = [
  {
    step: '1',
    title: 'Onboarding Process',
    text: 'Start by providing your career goals, current skillset, and educational background to help our AI understand your unique professional profile.',
    bullets: ['Goal setting', 'Skillset evaluation', 'Profile detailing', 'Preference mapping'],
    icon: <Person sx={{ fontSize: 48 }} />
  },
  {
    step: '2',
    title: 'Take Your Assessment',
    text: 'Complete an AI-powered assessment dynamically tailored to your specific career goals and current skill set to accurately gauge your proficiency.',
    bullets: ['Dynamic questions', 'Skill verification', 'Knowledge testing', 'Adaptive difficulty'],
    icon: <Assignment sx={{ fontSize: 48 }} />
  },
  {
    step: '3',
    title: 'Personalized Career Roadmap',
    text: 'Our AI generates a comprehensive, step-by-step career roadmap completely customized to bridge the gap between your current skills and your ultimate goal.',
    bullets: ['Step-by-step guide', 'Resource linking', 'Milestone setting', 'Skill gap analysis'],
    icon: <Description sx={{ fontSize: 48 }} />
  },
  {
    step: '4',
    title: 'Weekly Preparation Plan',
    text: 'Receive a personalized, AI-generated weekly study plan broken down into manageable chunks so you can easily adapt and stay consistent on your journey.',
    bullets: ['Weekly scheduling', 'Bite-sized tasks', 'Progress tracking', 'Adaptive pacing'],
    icon: <CalendarMonth sx={{ fontSize: 48 }} />
  },
  {
    step: '5',
    title: 'Achieve Success',
    text: 'Execute your plan with curated learning resources, expert mentorship, and continuous support. Build the confidence and skills needed to excel in your chosen field.',
    bullets: ['Expert mentorship', 'Continuous support', 'Interview prep', 'Career launch'],
    icon: <Work sx={{ fontSize: 48 }} />
  }
];

const TimelineStep = ({ step, index, isMobile }: { step: any, index: number, isMobile: boolean }) => {
  const isEven = index % 2 === 0;

  const textContent = (
    <ContentBlock sx={{ textAlign: isMobile ? 'left' : (isEven ? 'right' : 'left') }}>
      <StyledChip>Step {step.step}</StyledChip>
      <Typography variant="h3" sx={{ fontWeight: 800, color: '#1F2937', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        {step.title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#4B5563', lineHeight: 1.8, fontSize: '1.05rem', ml: isEven && !isMobile ? 'auto' : 0, maxWidth: '500px' }}>
        {step.text}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : (isEven ? 'flex-end' : 'flex-start') }}>
        <BulletList sx={{ gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, textAlign: 'left', maxWidth: '500px', width: '100%' }}>
          {step.bullets.map((b: string, i: number) => <BulletItem key={i}>{b}</BulletItem>)}
        </BulletList>
      </Box>
    </ContentBlock>
  );

  const iconContent = (
    <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: isMobile ? 'center' : (isEven ? 'flex-start' : 'flex-end') }}>
      <HugeNumber sx={{ [isEven ? 'left' : 'right']: isMobile ? '50%' : '10%', transform: isMobile ? 'translate(-50%, -50%)' : 'translateY(-50%)' }}>
        0{step.step}
      </HugeNumber>
      <IconContainerWrapper>
        <OuterCircle>
          <InnerCircle>
            {step.icon}
          </InnerCircle>
        </OuterCircle>
        <StepBadge>{step.step}</StepBadge>
      </IconContainerWrapper>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative', mb: { xs: 12, md: 20 } }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        {/* Horizontal connect line */}
        {!isMobile && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: isEven ? '50%' : 'calc(25% + 90px)',
            right: isEven ? 'calc(25% + 90px)' : '50%',
            height: '1px',
            backgroundColor: alpha('#462872', 0.15),
            zIndex: 1,
          }} />
        )}

        {/* Center Dot */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: isMobile ? '24px' : '50%',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#462872',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          boxShadow: `0 0 0 6px ${alpha('#462872', 0.15)}`,
        }} />

        <Grid container columnSpacing={isMobile ? 6 : 0} rowSpacing={isMobile ? 6 : 0} alignItems="center" sx={{ position: 'relative', zIndex: 2, pl: isMobile ? '60px' : 0 }}>
          {isMobile ? (
            <>
              <Grid item xs={12}>{iconContent}</Grid>
              <Grid item xs={12}>{textContent}</Grid>
            </>
          ) : (
            <>
              <Grid item xs={6}>{isEven ? textContent : iconContent}</Grid>
              <Grid item xs={6}>{isEven ? iconContent : textContent}</Grid>
            </>
          )}
        </Grid>
      </motion.div>
    </Box>
  );
};

const ProcessTimeline = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <TimelineContainer>
      
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 10, md: 16 }, maxWidth: '800px', mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <StyledChip sx={{ mb: 3 }}>Simple Process</StyledChip>
            <Typography variant="h2" sx={{ fontWeight: 900, color: '#1F2937', mb: 4, fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.2 }}>
              Your Path to<br/>Career Clarity
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.15rem', lineHeight: 1.8 }}>
              Follow our intelligent, data-driven process to discover your ideal career path and create a roadmap for success in just four simple steps.
            </Typography>
          </motion.div>
        </Box>

        {/* Timeline Steps */}
        <Box sx={{ position: 'relative', pt: 8 }}>
          <CenterLine />
          {steps.map((step, index) => (
            <TimelineStep key={step.step} step={step} index={index} isMobile={isMobile} />
          ))}
        </Box>
      </Container>
    </TimelineContainer>
  );
};

export default ProcessTimeline;
