import React from 'react';
import { Box, Container, Typography, Fade } from '@mui/material';
import { TOKEN } from '../constants';
import SectionLabel from '../components/SectionLabel';
import TeamCard from '../components/TeamCard';
import type { TeamMember } from '../types';

interface TeamSectionProps {
  show: boolean;
  team: TeamMember[];
  isMobile: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({ show, team, isMobile }) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <SectionLabel>Our Team</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              fontFamily: TOKEN.fontDisplay,
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              mt: 2,
            }}
          >
              Meet the Professionals
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {team.map((member, i) => (
            <Box
              key={i}
              sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}
            >
              <Fade in={show} timeout={900 + i * 150}>
                <Box>
                  <TeamCard member={member} isMobile={isMobile} />
                </Box>
              </Fade>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TeamSection;
