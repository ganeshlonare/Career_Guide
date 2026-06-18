import React from 'react';
import { Box, Typography, Button, Grid, Avatar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import StarIcon from '@mui/icons-material/Star';

const MentorCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  border: '1px solid rgba(70, 40, 114, 0.08)',
  boxShadow: '0 10px 30px rgba(70, 40, 114, 0.03)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  backgroundColor: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(70, 40, 114, 0.08)',
    border: '1px solid rgba(70, 40, 114, 0.2)',
  },
}));

const TopBanner = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '80px',
  background: 'linear-gradient(135deg, rgba(70,40,114,0.05) 0%, rgba(70,40,114,0.15) 100%)',
  zIndex: 0,
});

const mentors: any[] = []; // This will be fetched from the backend later

const Mentors = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#462872', mb: 2 }}>
          Expert Mentorship
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
          Connect with industry leaders who have walked your path. Book a 1-on-1 session to accelerate your career growth.
        </Typography>
      </Box>

      {mentors.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 10,
            px: 2,
            backgroundColor: 'rgba(70, 40, 114, 0.02)',
            borderRadius: '24px',
            border: '1px dashed rgba(70, 40, 114, 0.2)'
          }}
        >
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              backgroundColor: 'rgba(70, 40, 114, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <StarIcon sx={{ fontSize: 40, color: '#462872', opacity: 0.8 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
            No Mentors Available Right Now
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '400px', textAlign: 'center' }}>
            We are currently matching industry experts to your profile. Check back later to book your first 1-on-1 session!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {mentors.map((mentor) => (
          <Grid item xs={12} sm={6} lg={3} key={mentor.id}>
            <MentorCard>
              <TopBanner />
              <Avatar
                src={mentor.image}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  zIndex: 1,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              />
              
              <Box sx={{ zIndex: 1, width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                  {mentor.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#462872', fontWeight: 600, mb: 0.5 }}>
                  {mentor.role}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 2 }}>
                  at {mentor.company}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 3 }}>
                  <StarIcon sx={{ color: '#F59E0B', fontSize: '18px' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    {mentor.rating}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    ({mentor.reviews} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
                  {mentor.skills.map((skill) => (
                    <Box
                      key={skill}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        backgroundColor: 'rgba(70,40,114,0.05)',
                        color: '#462872',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {skill}
                    </Box>
                  ))}
                </Box>

                <Typography variant="body2" sx={{ color: '#555', mb: 4, lineHeight: 1.6, height: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {mentor.bio}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: '40px',
                      p: '8px',
                      borderColor: '#eee',
                      color: '#666',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        borderColor: '#ddd',
                      }
                    }}
                  >
                    <LinkedInIcon />
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#462872',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#3a2160',
                        boxShadow: '0 4px 12px rgba(70,40,114,0.2)',
                      }
                    }}
                  >
                    Book Session
                  </Button>
                </Box>
              </Box>
            </MentorCard>
          </Grid>
        ))}
        </Grid>
      )}
    </Box>
  );
};

export default Mentors;
