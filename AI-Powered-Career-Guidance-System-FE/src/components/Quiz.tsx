import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { assessmentApi } from '../api/assessment';
import { useNavigate } from 'react-router-dom';

type UIQuestion = { id: number; text: string; options: string[] };

const PageContainer = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled(Box)({
  height: '64px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  backgroundColor: '#fff',
});

const HeaderTitle = styled(Typography)({
  fontSize: '1rem',
  color: '#424446',
  display: 'flex',
  alignItems: 'center',
  '& > span': {
    margin: '0 8px',
    color: '#666',
  },
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  height: 'calc(100vh - 64px)',
});

const LeftSidebar = styled(Box)({
  width: '300px',
  borderRight: '1px solid #eee',
  backgroundColor: '#fff',
  overflowY: 'auto',
  padding: '24px',
});

const Legend = () => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 12, height: 12, backgroundColor: '#10B981', borderRadius: 1 }} />
      <Typography variant="caption">Answered</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 12, height: 12, backgroundColor: '#FCD34D', borderRadius: 1 }} />
      <Typography variant="caption">Visited</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 12, height: 12, backgroundColor: '#462872', borderRadius: 1 }} />
      <Typography variant="caption">Marked</Typography>
    </Box>
  </Box>
);

const QuestionGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '10px',
  marginTop: '20px',
});

const QuestionButton = styled(Button)<{ status?: 'answered' | 'current' | 'marked' | 'visited' | 'not-visited' }>(
  ({ status }) => ({
    minWidth: '40px',
    height: '40px',
    padding: '0',
    border: '1px solid #ddd',
    backgroundColor:
      status === 'answered'
        ? '#10B981'
        : status === 'marked'
        ? '#462872'
        : status === 'visited'
        ? '#fcec03'
        : '#fff',
    color: status === 'answered' || status === 'marked' ? '#fff' : '#424446',
    '&:hover': {
      backgroundColor:
        status === 'answered'
          ? '#10B981'
          : status === 'marked'
          ? '#462872'
          : status === 'visited'
          ? '#fcec03'
          : '#f5f5f5',
    },
    ...(status === 'current' && {
      border: '2px solid #462872',
    }),
  }),
);

const ContentSection = styled(Box)({
  flex: 1,
  padding: '32px',
  overflowY: 'auto',
});

const RightSidebar = styled(Box)({
  width: '300px',
  borderLeft: '1px solid #eee',
  backgroundColor: '#fff',
  padding: '24px',
});

const Timer = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 600,
  color: '#424446',
  textAlign: 'center',
  marginBottom: '24px',
});

const SummaryItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid #eee',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const defaultQuestions: UIQuestion[] = [
  { id: 1, text: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'] },
  { id: 2, text: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Saturn'] },
  { id: 3, text: 'What is the largest mammal in the world?', options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'] },
  { id: 4, text: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'] },
];

const SubmitConfirmation = ({
  open,
  onClose,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Submit Quiz?</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to submit your answers? You won't be able to make changes after submission.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={submitting}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={submitting}
        sx={{ backgroundColor: '#462872', '&:hover': { backgroundColor: '#3b2260' } }}
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </Button>
    </DialogActions>
  </Dialog>
);

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [questions, setQuestions] = useState<UIQuestion[]>(defaultQuestions);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [openExitConfirm, setOpenExitConfirm] = useState(false);
  const [openSubmitConfirm, setOpenSubmitConfirm] = useState(false);
  const totalQuestions = questions.length || 15;

  // Proctoring
  const [proctorDialogOpen, setProctorDialogOpen] = useState(true);
  const [proctoringActive, setProctoringActive] = useState(false);
  const [suspicionCount, setSuspicionCount] = useState(0);
  const [warningOpen, setWarningOpen] = useState(false);
  const camStreamRef = useRef<MediaStream | null>(null);
  const MAX_VIOLATIONS = 5;
  const questionsLoaded = useRef(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const addViolation = () => {
    setSuspicionCount(prev => {
      const next = prev + 1;
      setWarningOpen(true);
      if (next >= MAX_VIOLATIONS) setTimeout(() => handleSubmit(), 250);
      return next;
    });
  };

  // Proctoring listeners
  useEffect(() => {
    if (!proctoringActive) return;
    const handleFullscreenChange = () => { if (!document.fullscreenElement) addViolation(); };
    const handleVisibilityChange = () => { if (document.visibilityState === 'hidden') addViolation(); };
    const handleWindowBlur = () => { addViolation(); };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [proctoringActive]);

  const cleanupProctoring = () => {
    try { camStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    camStreamRef.current = null;
    setProctoringActive(false);
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch {}
  };

  const startQuiz = async () => {
    try {
      // No proctoring required - just start the quiz
      setProctoringActive(false);
      setProctorDialogOpen(false);
    } catch { 
      console.error('Failed to start quiz');
    }
  };

  // Load questions from API
  useEffect(() => {
    if (questionsLoaded.current) return;
    (async () => {
      try {
        console.log('[Quiz] Fetching questions from API...');
        const res: any = await assessmentApi.getQuestions();
        console.log('[Quiz] Raw API response:', res);
        
        // Handle nested response structure (API might return { data: { questions: [...], timeLimit: ... } })
        const responseData = res?.data ?? res;
        console.log('[Quiz] Response data:', responseData);
        
        const qs = responseData?.questions ?? responseData;
        console.log('[Quiz] Extracted questions:', qs);
        
        if (!qs || !Array.isArray(qs) || qs.length === 0) {
          console.error('[Quiz] Invalid questions format:', qs);
          throw new Error('No questions received from server');
        }

        const mapped: UIQuestion[] = qs.map((q: any, idx: number) => {
          console.log(`[Quiz] Mapping question ${idx + 1}:`, q);
          return {
            id: Number(q.id ?? idx + 1),
            text: q.question ?? q.text ?? 'Question text missing',
            options: (q.options ?? []).map((o: any) => (typeof o === 'string' ? o : o.label ?? o.key ?? '')),
          };
        });

        console.log('[Quiz] Mapped questions:', mapped);
        setQuestions(mapped);
        
        const tl = responseData?.timeLimit;
        console.log('[Quiz] Time limit:', tl);

        if (typeof tl === 'number' && tl > 0) {
          setTimeLimit(tl);
          setTimeLeft({ minutes: tl, seconds: 0 });
        }

        questionsLoaded.current = true;
        setShowQuestions(true);
        setProctoringActive(true); // Bypass proctoring requirement
        console.log('[Quiz] Questions loaded successfully!');
      } catch (error: any) {
        let errorMessage = 'Failed to load assessment questions';
        
        if (error?.details?.error) {
          errorMessage = error.details.error;
        } else if (error?.details?.message) {
          errorMessage = error.details.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        if (error?.status === 429 || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
          errorMessage = 'AI service is currently busy due to high demand. Please try again in a few minutes.';
        } else if (error?.status === 500 || errorMessage.includes('Operation failed')) {
          errorMessage = 'Assessment service is temporarily unavailable. Using sample questions.';
        } else if (errorMessage.includes('API key')) {
          errorMessage = 'Assessment service configuration error. Please contact support.';
        }
        
        alert(errorMessage);
        
        if (error?.status === 500 || error?.status === 429 || errorMessage.includes('Operation failed') || errorMessage.includes('quota')) {
          const fallbackQuestions = [
            {
              id: 1,
              text: "What type of work environment do you prefer?",
              options: ["Collaborative team environment", "Independent work", "Mixed approach", "Remote work"]
            },
            {
              id: 2,
              text: "How do you prefer to learn new skills?",
              options: ["Hands-on practice", "Reading documentation", "Video tutorials", "Mentorship"]
            },
            {
              id: 3,
              text: "What motivates you most in your career?",
              options: ["Financial rewards", "Creative expression", "Helping others", "Technical challenges"]
            },
            {
              id: 4,
              text: "How do you handle complex problems?",
              options: ["Break them down into smaller parts", "Seek help from others", "Research thoroughly", "Trial and error"]
            },
            {
              id: 5,
              text: "What work schedule do you prefer?",
              options: ["9-5 structured", "Flexible hours", "Project-based", "Early morning focus"]
            }
          ];
          
          const mapped: UIQuestion[] = fallbackQuestions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options,
          }));
          
          setQuestions(mapped);
          setTimeLimit(30); // 30 minutes for fallback
          setTimeLeft({ minutes: 30, seconds: 0 });
          questionsLoaded.current = true;
          setShowQuestions(true);
          setProctoringActive(true); // Bypass proctoring requirement
          console.log('[Quiz] Fallback questions loaded successfully!');
        } else {
          alert(errorMessage);
        }
      } finally {
        setLoadingQuestions(false);
      }
    })();
  }, []);

  // Timer
  useEffect(() => {
    if (!showQuestions) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          handleSubmit();
          return prev;
        }
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showQuestions]);

  const handleQuestionClick = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    setSelectedAnswer(answers[questionNumber] || '');
    if (!visitedQuestions.includes(questionNumber)) {
      setVisitedQuestions([...visitedQuestions, questionNumber]);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (!answeredQuestions.includes(currentQuestion)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
  };

  const handleMarkForReview = () => {
    if (markedQuestions.includes(currentQuestion)) {
      setMarkedQuestions(markedQuestions.filter(q => q !== currentQuestion));
    } else {
      setMarkedQuestions([...markedQuestions, currentQuestion]);
    }
  };

  const getQuestionStatus = (questionNumber: number) => {
    if (questionNumber === currentQuestion) return 'current';
    if (markedQuestions.includes(questionNumber)) return 'marked';
    if (answeredQuestions.includes(questionNumber)) return 'answered';
    if (visitedQuestions.includes(questionNumber)) return 'visited';
    return 'not-visited';
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      const nextQuestion = currentQuestion + 1;
      handleQuestionClick(nextQuestion);
    }
  };

  const handleSubmit = async () => {
    const arr = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));
    const totalTime = (timeLimit ?? 10) * 60 - (timeLeft.minutes * 60 + timeLeft.seconds);
    setSubmitting(true);
    try {
      await assessmentApi.submit({ answers: arr, timeTaken: Math.max(0, totalTime) });
      try { localStorage.setItem('cg_quiz_completed', '1'); } catch {}
      navigate('/dashboard/roadmap', { replace: true });
    } finally {
      setSubmitting(false);
      cleanupProctoring();
    }
  };

  const currentQuestionData = questions[currentQuestion - 1] || { text: 'Question not available', options: [] };

  return (
    <PageContainer>
      {/* Proctoring Dialog */}
      <Dialog open={proctorDialogOpen} disableEscapeKeyDown>
        <DialogTitle sx={{ pb: 1 }}>Ready to start?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This assessment will help us create your personalized career roadmap:
          </Typography>
          <ul>
            <li>Answer questions based on your skills and preferences</li>
            <li>Take your time - there's no time pressure</li>
            <li>Your results will generate your learning plan</li>
          </ul>
          <Typography variant="caption" sx={{ color: '#666' }}>
            The assessment typically takes 15-20 minutes to complete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitConfirm(true)} sx={{ color: '#424446' }}>Cancel</Button>
          <Button variant="contained" onClick={startQuiz} sx={{ backgroundColor: '#462872' }}>Start Assessment</Button>
        </DialogActions>
      </Dialog>

      {/* Warning Snackbar */}
      <Snackbar
        open={warningOpen}
        autoHideDuration={2000}
        onClose={() => setWarningOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={suspicionCount >= MAX_VIOLATIONS ? 'error' : 'warning'} sx={{ width: '100%' }}>
          {suspicionCount >= MAX_VIOLATIONS
            ? 'Exam auto-submitted due to repeated suspicious activity.'
            : `Suspicious activity detected (${suspicionCount}/${MAX_VIOLATIONS}). Stay in fullscreen and do not switch tabs.`}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Header>
        <HeaderTitle variant="h6">
          Career Guidance Quiz <span>{'>'}</span> Section A
        </HeaderTitle>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={`Warnings: ${suspicionCount}/${MAX_VIOLATIONS}`}
            color={suspicionCount === 0 ? 'default' : (suspicionCount < MAX_VIOLATIONS ? 'warning' : 'error') as any}
            variant={suspicionCount === 0 ? 'outlined' : 'filled'}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={() => setOpenExitConfirm(true)}
            sx={{ color: '#424446', borderColor: '#ddd' }}
          >
            Exit
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => setOpenSubmitConfirm(true)}
            sx={{ backgroundColor: '#462872', '&:hover': { backgroundColor: '#3b2260' } }}
          >
            Review and Submit
          </Button>
        </Box>
      </Header>

      {/* Main Content */}
      {loadingQuestions ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 3 }}>
          <Box>
            <CircularProgress sx={{ color: '#462872', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#424446', mb: 1 }}>
              Generating questions...
            </Typography>
          </Box>
        </Box>
      ) : (
        <MainContent>
          <LeftSidebar>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: '#424446', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                Section A
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem', color: '#666' }}>
                  <Box sx={{ color: '#10B981' }}>{answeredQuestions.length}</Box> • {totalQuestions}
                </Box>
              </Typography>

              <Button
                variant="outlined"
                onClick={handleMarkForReview}
                sx={{
                  color: markedQuestions.includes(currentQuestion) ? '#fff' : '#462872',
                  backgroundColor: markedQuestions.includes(currentQuestion) ? '#462872' : 'transparent',
                  borderColor: '#462872',
                  '&:hover': {
                    backgroundColor: markedQuestions.includes(currentQuestion) ? '#3b2260' : 'rgba(70, 40, 114, 0.04)',
                    borderColor: '#462872',
                  },
                  mb: 3
                }}
              >
                Mark for Review
              </Button>

              <Legend />
              <QuestionGrid>
                {Array.from({ length: totalQuestions }, (_, i) => (
                  <QuestionButton
                    key={i + 1}
                    onClick={() => handleQuestionClick(i + 1)}
                    status={getQuestionStatus(i + 1)}
                  >
                    {i + 1}
                  </QuestionButton>
                ))}
              </QuestionGrid>
            </Box>
          </LeftSidebar>

          <ContentSection>
            <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#424446' }}>Q: {currentQuestion}</Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 4, color: '#424446' }}>
                {currentQuestionData.text}
              </Typography>

              <RadioGroup value={selectedAnswer} onChange={e => handleAnswerSelect(e.target.value)}>
                {currentQuestionData.options.map((option, idx) => (
                  <FormControlLabel key={idx} value={option} control={<Radio />} label={option} sx={{ mb: 2 }} />
                ))}
              </RadioGroup>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
                <Button startIcon={bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />} onClick={() => setBookmarked(!bookmarked)} sx={{ color: '#424446' }}>
                  Bookmark
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedAnswer('');
                      setAnswers({ ...answers, [currentQuestion]: '' });
                      setAnsweredQuestions(answeredQuestions.filter(q => q !== currentQuestion));
                    }}
                    sx={{ color: '#424446', borderColor: '#ddd' }}
                  >
                    Clear Response
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    disabled={submitting}
                    onClick={currentQuestion === totalQuestions ? () => setOpenSubmitConfirm(true) : handleNext}
                    sx={{ backgroundColor: '#462872', '&:hover': { backgroundColor: '#3b2260' } }}
                  >
                    {currentQuestion === totalQuestions ? (submitting ? 'Submitting…' : 'Submit') : 'Next'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </ContentSection>

          <RightSidebar>
            <Timer>{String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}</Timer>
            <Typography variant="subtitle1" sx={{ mb: 2, color: '#424446' }}>Overview</Typography>
            {[{ label: 'Total Questions', value: totalQuestions },
              { label: 'Visited', value: visitedQuestions.length },
              { label: 'Not Visited', value: totalQuestions - visitedQuestions.length },
              { label: 'Answered', value: answeredQuestions.length },
              { label: 'Not Answered', value: visitedQuestions.length - answeredQuestions.length },
              { label: 'Marked for review', value: markedQuestions.length },
              { label: 'Bookmarked', value: bookmarked ? 1 : 0 }].map(item => (
                <SummaryItem key={item.label}>
                  <Typography variant="body2" sx={{ color: '#666' }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ color: '#424446' }}>{item.value}</Typography>
                </SummaryItem>
            ))}
          </RightSidebar>
        </MainContent>
      )}

      {/* Exit Confirmation */}
      <Dialog open={openExitConfirm} onClose={() => setOpenExitConfirm(false)}>
        <DialogTitle>Exit Assessment?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Your progress may be lost. Are you sure you want to exit?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExitConfirm(false)}>Cancel</Button>
          <Button color="error" onClick={() => { setOpenExitConfirm(false); cleanupProctoring(); window.history.back(); }}>Exit</Button>
        </DialogActions>
      </Dialog>

      <SubmitConfirmation
        open={openSubmitConfirm}
        onClose={() => setOpenSubmitConfirm(false)}
        onSubmit={() => { setOpenSubmitConfirm(false); handleSubmit(); }}
        submitting={submitting}
      />
    </PageContainer>
  );
};

export default Quiz;

