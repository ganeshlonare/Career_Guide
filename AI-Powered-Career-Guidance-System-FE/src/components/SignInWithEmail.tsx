import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AppLogo from "./common/Logo";

// Styled Components
const PageContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  width: "100%",
});

const FormSection = styled(Box)(({ theme }) => ({
  flex: "1 1 50%",
  display: "flex",
  flexDirection: "column",
  padding: "40px",
  backgroundColor: "#FFFFFF",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    flex: "1 1 100%",
    padding: "24px",
  },
}));

const FormContainer = styled(Box)({
  width: "100%",
  maxWidth: "440px",
  margin: "auto",
});

const BrandSection = styled(Box)(({ theme }) => ({
  flex: "1 1 50%",
  background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "80px",
  color: "#FFFFFF",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const GlowOrb = styled(Box)({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(100px)",
  opacity: 0.5,
  pointerEvents: "none",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#F9FAFB",
    transition: "all 0.2s ease-in-out",
    "& fieldset": { borderColor: "#E5E7EB" },
    "&:hover fieldset": { borderColor: "#D1D5DB" },
    "&.Mui-focused": {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 0 0 4px rgba(70, 40, 114, 0.1)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#462872",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "16px",
    fontSize: "0.95rem",
  },
});

const MainButton = styled(Button)({
  borderRadius: "12px",
  padding: "14px",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  backgroundColor: "#462872",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(70, 40, 114, 0.2)",
  "&:hover": { 
    backgroundColor: "#3b2260",
    boxShadow: "0 6px 16px rgba(70, 40, 114, 0.3)",
  },
});

const SocialButton = styled(Button)({
  borderRadius: "12px",
  padding: "14px",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#374151",
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  "&:hover": {
    backgroundColor: "#F9FAFB",
    borderColor: "#D1D5DB",
  },
});

const FeatureItem = ({ text }: { text: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    <CheckCircleOutlineIcon sx={{ color: '#00E676', fontSize: 24 }} />
    <Typography sx={{ fontSize: '1.1rem', fontWeight: 400, color: '#E5E7EB' }}>{text}</Typography>
  </Box>
);

const SignInWithEmail = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/verify-email");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecruiterDemo = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // Set the values in state just so the UI updates
      setEmail("ganeshlonareofficial@gmail.com");
      setPassword("ganesh123");
      
      await login({ email: "ganeshlonareofficial@gmail.com", password: "ganesh123" });
      navigate("/verify-email");
    } catch (err: any) {
      setError(err?.message || "Demo login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      const onboarded =
        (typeof window !== "undefined" &&
          localStorage.getItem("cg_onboarded") === "1") ||
        (user as any)?.onboardingCompleted === true;
      const quizDone =
        (typeof window !== "undefined" &&
          localStorage.getItem("cg_quiz_completed") === "1") ||
        (user as any)?.quizCompleted === true;
      if (!onboarded) {
        navigate("/onboarding", { replace: true });
      } else if (!quizDone) {
        navigate("/assessment/instructions", { replace: true });
      } else {
        navigate("/dashboard/overview", { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <PageContainer>
      <FormSection>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ position: 'absolute', top: { xs: 16, md: 32 }, left: { xs: 16, md: 32 }, color: '#6B7280', textTransform: 'none', fontWeight: 600 }}
        >
          Back to home
        </Button>

        <FormContainer>
          <Box sx={{ mb: 6, mt: 6 }}>
            <AppLogo size="medium" />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", mt: 4, mb: 1, letterSpacing: '-0.5px' }}>
              Welcome back
            </Typography>
            <Typography sx={{ color: "#6B7280", fontSize: "1rem" }}>
              Sign in to continue your journey towards success.
            </Typography>
          </Box>

          {!!error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <SocialButton 
            fullWidth 
            onClick={handleRecruiterDemo}
            sx={{ 
              mb: 2, 
              borderColor: '#462872', 
              color: '#462872',
              backgroundColor: 'rgba(70, 40, 114, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(70, 40, 114, 0.08)',
                borderColor: '#462872'
              }
            }}
          >
            Sign in as Guest (Recruiter Demo)
          </SocialButton>

          <SocialButton fullWidth startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />} sx={{ mb: 4 }}>
            Sign in with Google
          </SocialButton>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ px: 2, color: '#9CA3AF', fontSize: '0.875rem', fontWeight: 500 }}>
              or sign in with email
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Box component="form" onSubmit={onSubmit} noValidate>
            <StyledTextField
              label="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2.5 }}
            />
            <StyledTextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      sx={{ color: '#9CA3AF' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <MainButton type="submit" fullWidth disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </MainButton>
          </Box>

          <Typography sx={{ textAlign: "center", mt: 4, color: "#6B7280", fontSize: "0.95rem" }}>
            Don't have an account?{" "}
            <Box
              component="span"
              onClick={() => navigate("/signup")}
              sx={{ color: "#462872", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Sign up
            </Box>
          </Typography>
        </FormContainer>
      </FormSection>

      <BrandSection>
        <GlowOrb sx={{ width: '600px', height: '600px', backgroundColor: '#5E35B1', top: '-200px', right: '-200px' }} />
        <GlowOrb sx={{ width: '500px', height: '500px', backgroundColor: '#FF8E53', bottom: '-200px', left: '-100px', opacity: 0.2 }} />
        
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '500px', margin: '0 auto' }}>
          <Typography sx={{ color: '#A78BFA', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', mb: 2, fontSize: '0.85rem' }}>
            Welcome to the future
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 6, lineHeight: 1.2, letterSpacing: '-1px' }}>
            Kickstart Your <br />
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #00C6FF, #0072FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Career Journey
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FeatureItem text="Find your perfect career path based on skills" />
            <FeatureItem text="Get AI-powered insights and roadmap" />
            <FeatureItem text="Track your progress and land your dream job" />
          </Box>
        </Box>
      </BrandSection>
    </PageContainer>
  );
};

export default SignInWithEmail;
