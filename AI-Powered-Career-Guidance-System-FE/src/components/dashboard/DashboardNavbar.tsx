import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import xpIcon from "../../assets/xp-icon.svg";
import StreakIntroModal from "./StreakIntroModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppLogo from "../common/Logo";

const NavbarContainer = styled(Box)({
  height: "70px",
  width: "100%",
  backgroundColor: "#fff",
  borderBottom: "1px solid #eee",
  display: "flex",
  alignItems: "center",
  padding: "0 24px",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1100,
});

const LogoSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  minWidth: "180px",
});

const CenterSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  transform: "translateX(-170px)",
});

const CourseBox = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: "#f8f9fa",
  borderRadius: "6px",
  padding: "8px 16px",
  cursor: "pointer",
  transition: "all 0.2s",
  border: "1px solid #eee",
  "&:hover": {
    backgroundColor: "#f0f1f2",
  },
});

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "18px",
  minWidth: "280px",
  justifyContent: "flex-end",
  marginRight: "114px",
});

const StatBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

const StatIconButton = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  backgroundColor: "#f8f9fa",
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "#f0f1f2",
  },
});



interface DashboardNavbarProps {
  userName: string;
  flameCount: number;
  xpCount: number;
  onXPClick: () => void;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  userName,
  flameCount,
  xpCount,
  onXPClick,
}) => {
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleOpenStreakModal = () => {
    setStreakModalOpen(true);
  };

  const handleCloseStreakModal = () => {
    setStreakModalOpen(false);
  };

  const handleStartStreak = () => {
    // Add your streak start logic here
    setStreakModalOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    try {
      logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <>
      <NavbarContainer>
        <LogoSection onClick={handleLogoClick} sx={{ cursor: 'pointer' }}>
          <AppLogo size="small" />
        </LogoSection>

        <CenterSection>
          <CourseBox>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                component="span"
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  backgroundColor: "#E3F2FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                🎓
              </Box>
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  color: "#424446",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                CareerAI Workspace
              </Typography>
            </Box>
          </CourseBox>
        </CenterSection>

        <RightSection>
          <StatBox>
            <StatIconButton onClick={handleOpenStreakModal}>
              <LocalFireDepartmentIcon
                sx={{ color: "#FF6B6B", fontSize: "22px" }}
              />
            </StatIconButton>
            <Typography
              sx={{ fontSize: "0.9rem", color: "#424446", fontWeight: 500 }}
            >
              {flameCount}
            </Typography>
          </StatBox>

          <StatBox>
            <StatIconButton onClick={onXPClick}>
              <img
                src={xpIcon}
                alt="XP"
                style={{ width: "22px", height: "22px" }}
              />
            </StatIconButton>
            <Typography
              sx={{ fontSize: "0.9rem", color: "#424446", fontWeight: 500 }}
            >
              {xpCount}
            </Typography>
          </StatBox>


        </RightSection>
      </NavbarContainer>

      <StreakIntroModal
        open={streakModalOpen}
        onClose={handleCloseStreakModal}
        onStart={handleStartStreak}
      />
    </>
  );
};

export default DashboardNavbar;
