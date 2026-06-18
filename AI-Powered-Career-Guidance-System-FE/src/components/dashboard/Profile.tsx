import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  LocationOn,
  Language,
  GitHub,
  LinkedIn,
  Edit as EditIcon,
  AutoGraph as CareerIcon,
  School as EducationIcon,
} from "@mui/icons-material";

import { userApi } from "../../api/user";
import type { UserProfile } from "../../types/user";
import { useAuth } from "../../hooks/useAuth";

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
  [theme.breakpoints.down("md")]: {
    padding: "16px",
  },
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
  background: "#FFFFFF",
  overflow: "hidden",
  marginBottom: "24px",
}));

const Banner = styled(Box)({
  height: "160px",
  background: "linear-gradient(135deg, #462872 0%, #2D1B4E 100%)",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('/purple-bg.svg') no-repeat center center",
    backgroundSize: "cover",
    opacity: 0.4,
  },
});

const HeaderContent = styled(Box)(({ theme }) => ({
  padding: "0 40px 40px",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0 24px 32px",
  },
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  marginTop: "-60px",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    marginTop: "-70px",
    marginBottom: "16px",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 140,
  height: 140,
  border: "6px solid #FFFFFF",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  backgroundColor: "#F3F4F6",
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: "32px",
  borderRadius: "24px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04)",
  background: "#FFFFFF",
  height: "100%",
}));

const EditButton = styled(Button)({
  backgroundColor: "#F3F4F6",
  color: "#374151",
  borderRadius: "12px",
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#E5E7EB",
    boxShadow: "none",
  },
});

const InfoRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
  color: "#4B5563",
});

const SectionTitle = styled(Typography)({
  fontWeight: 700,
  color: "#111827",
  fontSize: "1.25rem",
  marginBottom: "24px",
});

const StyledChip = styled(Chip)({
  backgroundColor: "rgba(70, 40, 114, 0.08)",
  color: "#462872",
  fontWeight: 500,
  borderRadius: "12px",
  padding: "4px",
  "&:hover": {
    backgroundColor: "rgba(70, 40, 114, 0.15)",
  },
});

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await userApi.getProfile();
        setProfile(p);
      } catch {
        // use fallback if backend fails
      }
    })();
  }, []);

  const displayName = React.useMemo(() => {
    if (!user) return 'User';
    const first = user.firstName?.trim();
    const last = user.lastName?.trim();
    if (first || last) return [first, last].filter(Boolean).join(' ');
    const email = user.email || '';
    return email.includes('@') ? email.split('@')[0] : email;
  }, [user]);

  const displayProfile = {
    id: user?.id || profile?.id || "me",
    name: displayName,
    email: user?.email || profile?.email || "",
    avatarUrl: user?.email ? `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}` : undefined,
    bio: profile?.bio || "Passionate software developer always looking to learn new technologies and build impactful products.",
    skills: profile?.skills?.length ? profile.skills : ["JavaScript", "React", "Node.js", "TypeScript", "Tailwind CSS"],
    interests: profile?.interests?.length ? profile.interests : ["Open Source", "UI/UX Design", "Hackathons", "Tech Blogging"],
    linkedin: profile?.linkedin || "linkedin.com/in/" + displayName.replace(' ', '').toLowerCase(),
    github: profile?.github || "github.com/" + displayName.replace(' ', '').toLowerCase(),
    website: profile?.website || "",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageContainer>
      <ProfileHeader>
        <Banner />
        <HeaderContent>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
            <AvatarWrapper>
              <StyledAvatar src={displayProfile.avatarUrl}>
                {getInitials(displayProfile.name)}
              </StyledAvatar>
            </AvatarWrapper>
            <Box sx={{ pb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}>
                {displayProfile.name}
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: "1.05rem" }}>
                {displayProfile.email}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ pb: 1 }}>
            <EditButton startIcon={<EditIcon />}>Edit Profile</EditButton>
          </Box>
        </HeaderContent>
      </ProfileHeader>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ContentCard>
              <SectionTitle>About Me</SectionTitle>
              <Typography sx={{ color: "#4B5563", lineHeight: 1.7, mb: 4 }}>
                {displayProfile.bio || "No biography provided yet. Edit your profile to tell us about your career goals!"}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <SectionTitle>Contact & Links</SectionTitle>
              <InfoRow>
                <LocationOn sx={{ color: "#9CA3AF" }} />
                <Typography>Planet Earth</Typography>
              </InfoRow>
              {(displayProfile.linkedin || displayProfile.github || displayProfile.website) ? (
                <>
                  {displayProfile.linkedin && (
                    <InfoRow>
                      <LinkedIn sx={{ color: "#0A66C2" }} />
                      <Typography>{displayProfile.linkedin}</Typography>
                    </InfoRow>
                  )}
                  {displayProfile.github && (
                    <InfoRow>
                      <GitHub sx={{ color: "#333" }} />
                      <Typography>{displayProfile.github}</Typography>
                    </InfoRow>
                  )}
                  {displayProfile.website && (
                    <InfoRow>
                      <Language sx={{ color: "#462872" }} />
                      <Typography>{displayProfile.website}</Typography>
                    </InfoRow>
                  )}
                </>
              ) : (
                <Typography sx={{ color: "#9CA3AF", fontStyle: "italic", fontSize: "0.9rem" }}>
                  No social links added yet.
                </Typography>
              )}
            </ContentCard>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
            <ContentCard>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <CareerIcon sx={{ color: '#462872', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
                  Skills & Expertise
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
                {displayProfile.skills && displayProfile.skills.length > 0 ? (
                  displayProfile.skills.map((skill, index) => (
                    <StyledChip key={index} label={skill} />
                  ))
                ) : (
                  <Typography sx={{ color: "#9CA3AF", fontStyle: "italic" }}>
                    No skills added yet. Complete your onboarding to add skills.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <EducationIcon sx={{ color: '#462872', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>
                  Achievements & Interests
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {displayProfile.interests && displayProfile.interests.length > 0 ? (
                  displayProfile.interests.map((interest, index) => (
                    <Chip 
                      key={index} 
                      label={interest} 
                      variant="outlined"
                      sx={{ borderColor: '#E5E7EB', color: '#4B5563', borderRadius: '12px' }}
                    />
                  ))
                ) : (
                  <Typography sx={{ color: "#9CA3AF", fontStyle: "italic" }}>
                    No achievements or interests added yet.
                  </Typography>
                )}
              </Box>
            </ContentCard>
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Profile;
