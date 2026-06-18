import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { alpha } from '@mui/material';
import ProductionNavbar from './components/ProductionNavbar';
import ModernHero from './components/ModernHero';
import SignUp from './components/SignUp';
import SignInWithEmail from './components/SignInWithEmail';
import Onboarding from './components/Onboarding';
import Quiz from './components/Quiz';
import AssessmentInstructions from './components/AssessmentInstructions';
import AssessmentResults from './components/AssessmentResults';
import Roadmap from './components/Roadmap';
import WeekPlan from './components/WeekPlan';
import DashboardOverview from './components/DashboardOverview';
import DashboardRoadmap from './components/dashboard/DashboardRoadmap';
import Profile from './components/dashboard/Profile';
import ComingSoon from './components/dashboard/ComingSoon';
import Mentors from './components/dashboard/Mentors';
import Support from './components/dashboard/Support';
import Settings from './components/dashboard/Settings';
import ResumeBuilder from './components/ResumeBuilder';
import Footer from './components/Footer';
import ProcessTimeline from './components/ProcessTimeline';
import ProductShowcase from './components/ProductShowcase';
import ComparisonSection from './components/ComparisonSection';
import WhyChooseUs from './components/WhyChooseUs';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import IndustryInsights from './components/IndustryInsights';
import Jobs from './components/Jobs';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import VerifyEmail from './components/auth/VerifyEmail';
import GlobalGuard from './components/common/GlobalGuard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5E35B1',
      dark: '#4527A0',
      light: '#7E57C2',
    },
    secondary: {
      main: '#FF6B6B',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F4',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          boxShadow: '0 4px 15px rgba(94, 53, 177, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(94, 53, 177, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const HomePage = () => (
  <>
    <Box sx={{ 
      position: 'relative', 
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.6,
        backgroundSize: '60px 60px',
        backgroundImage: `linear-gradient(to right, ${alpha('#462872', 0.08)} 1px, transparent 1px), linear-gradient(to bottom, ${alpha('#462872', 0.08)} 1px, transparent 1px)`,
        pointerEvents: 'none',
        zIndex: 0,
      }
    }}>
      <ProductionNavbar />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <ModernHero />
        <ComparisonSection />
        <ProductShowcase />
        <ProcessTimeline />
        <WhyChooseUs />
        <FAQSection />
        <FinalCTA />
      </Box>
    </Box>
    <Footer />
  </>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ 
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <GlobalGuard>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin/email" element={<SignInWithEmail />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/assessment/instructions" element={<AssessmentInstructions />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/week-plan" element={<WeekPlan />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard/assessment" element={<Quiz />} />
                  <Route path="/dashboard/assessment/results" element={<AssessmentResults />} />
                  <Route path="/assessment/results" element={<AssessmentResults />} />
                  <Route path="/dashboard/overview" element={<DashboardOverview />} />
                  <Route path="/dashboard/roadmap" element={<DashboardOverview />}>
                    <Route index element={<DashboardRoadmap />} />
                  </Route>
                  <Route path="/dashboard/profile" element={<DashboardOverview />}>
                    <Route index element={<Profile />} />
                  </Route>
                  <Route path="/dashboard/resume-builder" element={<DashboardOverview />}>
                    <Route index element={<ComingSoon />} />
                  </Route>
                  <Route path="/dashboard/industry-insights" element={<DashboardOverview />}>
                    <Route index element={<ComingSoon />} />
                  </Route>
                  <Route path="/dashboard/jobs" element={<DashboardOverview />}>
                    <Route index element={<ComingSoon />} />
                  </Route>
                  <Route path="/dashboard/community" element={<DashboardOverview />}>
                    <Route index element={<ComingSoon />} />
                  </Route>
                  <Route path="/dashboard/mentors" element={<DashboardOverview />}>
                    <Route index element={<Mentors />} />
                  </Route>
                  <Route path="/dashboard/support" element={<DashboardOverview />}>
                    <Route index element={<Support />} />
                  </Route>
                  <Route path="/dashboard/settings" element={<DashboardOverview />}>
                    <Route index element={<Settings />} />
                  </Route>
                </Route>
              </Routes>
            </GlobalGuard>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

