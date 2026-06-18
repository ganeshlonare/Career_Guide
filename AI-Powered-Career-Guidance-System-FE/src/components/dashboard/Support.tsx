import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Accordion, AccordionSummary, AccordionDetails, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  border: '1px solid rgba(70, 40, 114, 0.1)',
  boxShadow: '0 4px 12px rgba(70, 40, 114, 0.02)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: '#fff',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(70, 40, 114, 0.06)',
    borderColor: 'rgba(70, 40, 114, 0.2)',
  },
}));

const IconWrapper = styled(Box)({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: 'rgba(70, 40, 114, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  color: '#462872',
});

const faqs = [
  {
    question: "How does the AI career roadmap generation work?",
    answer: "Our system analyzes your initial assessment answers, current skills, and career goals using advanced LLMs to generate a personalized, step-by-step learning path tailored specifically to your needs.",
  },
  {
    question: "Can I switch my career track later?",
    answer: "Yes! You can retake the assessment at any time from your profile settings to generate a brand new roadmap for a different career path or specialization.",
  },
  {
    question: "How do I book a session with a mentor?",
    answer: "Navigate to the Mentors tab in your dashboard, browse the available experts, and click 'Book Session'. You can choose a time slot that works best for your schedule.",
  },
  {
    question: "Are the learning resources free?",
    answer: "We curate the best high-quality resources across the web. While many of our recommended videos and articles are free, some specialized courses may require separate subscriptions on their respective platforms.",
  }
];

const Support = () => {
  const [expanded, setExpanded] = useState<number | false>(0);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#462872', mb: 2 }}>
          How can we help you?
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
          Our support team is here to ensure you have the best possible experience on your career journey.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <ContactCard>
            <IconWrapper>
              <EmailIcon fontSize="large" />
            </IconWrapper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
              Email Support
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              ganeshlonare311@gmail.com
            </Typography>
            <Button 
              variant="outlined" 
              href="mailto:ganeshlonare311@gmail.com"
              sx={{ borderColor: '#462872', color: '#462872', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(70,40,114,0.04)' } }}
            >
              Send Email
            </Button>
          </ContactCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ContactCard>
            <IconWrapper>
              <HelpOutlineIcon fontSize="large" />
            </IconWrapper>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
              Help Center
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Browse our comprehensive documentation.
            </Typography>
            <Button variant="outlined" sx={{ borderColor: '#462872', color: '#462872', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: 'rgba(70,40,114,0.04)' } }}>
              View Docs
            </Button>
          </ContactCard>
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              expanded={expanded === index} 
              onChange={handleChange(index)}
              sx={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: expanded === index ? 'rgba(70,40,114,0.3)' : '#eee',
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                transition: 'all 0.2s ease',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: expanded === index ? '#462872' : '#888' }} />}
                sx={{
                  py: 1,
                  px: 3,
                  backgroundColor: expanded === index ? 'rgba(70,40,114,0.02)' : 'transparent',
                  borderRadius: '12px',
                }}
              >
                <Typography sx={{ fontWeight: expanded === index ? 600 : 500, color: expanded === index ? '#462872' : '#333' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                <Typography sx={{ color: '#666', lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Support;
