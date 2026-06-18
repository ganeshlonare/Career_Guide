import React, { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, alpha } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.02)',
  borderRadius: '16px !important',
  marginBottom: '16px',
  border: '1px solid #EAEAEA',
  '&:before': {
    display: 'none',
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: alpha('#462872', 0.3),
    boxShadow: '0 8px 32px rgba(70, 40, 114, 0.06)',
  }
}));

const faqs = [
  {
    question: 'Is the AI career assessment completely free?',
    answer: 'Yes! Registration and the initial comprehensive AI career assessment are completely free. We believe everyone deserves access to intelligent, high-quality career guidance.'
  },
  {
    question: 'How accurate is the AI career matching?',
    answer: 'Our AI engine is trained on thousands of career trajectories and current market data. By analyzing your skills, interests, and goals, it provides highly accurate and personalized role matches that perfectly align with industry demands.'
  },
  {
    question: 'Can I update my skills later to get a new roadmap?',
    answer: 'Absolutely. Your career journey is dynamic. As you learn new skills and complete milestones, you can update your profile, and the AI will dynamically recalculate your personalized roadmap and weekly plans.'
  },
  {
    question: 'What kind of support will I get during my weekly plans?',
    answer: 'Your weekly preparation plan breaks down your overarching roadmap into bite-sized, actionable tasks. This includes curated learning resources, project recommendations, and progress tracking to keep you strictly on target.'
  },
  {
    question: 'Is this platform only for IT and Tech students?',
    answer: 'While we have deep integrations for tech roles, our AI is capable of generating tailored roadmaps for a wide variety of industries including finance, marketing, design, and management.'
  }
];

const FAQSection = () => {
  const [expanded, setExpanded] = useState<number | false>(0);

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'transparent', position: 'relative', zIndex: 2 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#1F2937', mb: 3, fontSize: { xs: '2rem', md: '2.75rem' } }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
            Everything you need to know about our AI-powered guidance system.
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StyledAccordion expanded={expanded === index} onChange={handleChange(index)}>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: '#462872' }} />}
                  sx={{ px: { xs: 2, md: 4 }, py: 2 }}
                >
                  <Typography sx={{ fontWeight: 600, color: '#1F2937', fontSize: '1.05rem' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, md: 4 }, pb: 4, pt: 0 }}>
                  <Typography sx={{ color: '#4B5563', lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
