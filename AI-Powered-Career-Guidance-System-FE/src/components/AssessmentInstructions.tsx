import React, { useRef, useState } from 'react';
import { Box, Paper, Typography, Button, Alert, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

const PageWrap = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: '#f7f7fb',
});

const Card = styled(Paper)({
  maxWidth: 820,
  width: '100%',
  padding: '32px',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
});

const StartButton = styled(Button)({
  backgroundColor: '#462872',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: 24,
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  '&:hover': { backgroundColor: '#3b2260' },
});

const AssessmentInstructions: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const cleanup = async () => {
    try { camStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    try { screenStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    camStreamRef.current = null;
    screenStreamRef.current = null;
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch {}
  };

  const startAssessment = async () => {
    setError(null);
    // Directly navigate to assessment without permissions
    try { localStorage.setItem('cg_proctor_preflight_ok', '1'); } catch {}
    navigate('/dashboard/assessment', { replace: true });
  };

  // If flag set (e.g., after onboarding), auto-start the assessment
  React.useEffect(() => {
    const auto = typeof window !== 'undefined' && localStorage.getItem('cg_autostart_quiz') === '1';
    if (auto) {
      try { localStorage.removeItem('cg_autostart_quiz'); } catch {}
      // small delay to ensure page paint before starting assessment
      setTimeout(() => { startAssessment(); }, 200);
    }
    return () => { cleanup(); };
  }, []);

  return (
    <PageWrap>
      <Card>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SecurityIcon sx={{ color: '#462872' }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#424446' }}>
            Assessment Instructions
          </Typography>
        </Box>

        <Alert icon={<InfoOutlinedIcon />} severity="info" sx={{ mb: 2 }}>
          This assessment will help us understand your skills and preferences to generate a personalized career roadmap.
        </Alert>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#424446' }}>Assessment Guidelines</Typography>
        <List dense>
          <ListItem><ListItemText primary="Answer honestly based on your actual skills and preferences." /></ListItem>
          <ListItem><ListItemText primary="Take your time to read each question carefully." /></ListItem>
          <ListItem><ListItemText primary="There are no right or wrong answers - this is about finding your best fit." /></ListItem>
          <ListItem><ListItemText primary="The assessment typically takes 15-20 minutes to complete." /></ListItem>
          <ListItem><ListItemText primary="Your results will be used to generate your personalized learning roadmap." /></ListItem>
        </List>

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1, color: '#424446' }}>Test Guidelines</Typography>
        <List dense>
          <ListItem><ListItemText primary="Check your internet connection and power before starting." /></ListItem>
          <ListItem><ListItemText primary="Each question may have one correct answer unless specified." /></ListItem>
          <ListItem><ListItemText primary="You can review and submit when you are done." /></ListItem>
        </List>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={() => navigate('/dashboard/overview')} sx={{ color: '#424446' }}>Cancel</Button>
          <StartButton endIcon={<ArrowForwardIcon />} onClick={startAssessment}>
            Start Assessment
          </StartButton>
        </Box>
      </Card>
    </PageWrap>
  );
};

export default AssessmentInstructions;
