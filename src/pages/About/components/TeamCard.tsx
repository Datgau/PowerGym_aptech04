import React, { useState } from 'react';
import { Box, Card, Typography, Avatar } from '@mui/material';
import { Star } from '@mui/icons-material';
import { TOKEN } from '../constants';
import type { TeamMember } from '../types';

interface TeamCardProps {
  member: TeamMember;
  isMobile: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, isMobile }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: TOKEN.radiusMd,
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        alignItems: isMobile ? 'center' : 'center',
        textAlign: isMobile ? 'left' : 'center',
        gap: isMobile ? 2 : 0,
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 20px 60px rgba(0,180,255,0.2)`
          : '0 2px 20px rgba(0,0,0,0.06)',
        transition: TOKEN.transition,
        position: 'relative',
        overflow: 'hidden',
        background: 'white',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: TOKEN.gradientMain,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transition: TOKEN.transition,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          mb: isMobile ? 0 : 2,
          flexShrink: 0,
        }}
      >
        <Avatar
          src={member.image}
          sx={{
            width: isMobile ? 72 : 112,
            height: isMobile ? 72 : 112,
            border: '4px solid transparent',
            background: `linear-gradient(white, white) padding-box, ${TOKEN.gradientMain} border-box`,
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: hovered ? TOKEN.glowSm : 'none',
          }}
        />
        <Star
          sx={{
            position: 'absolute',
            top: -6,
            right: -6,
            color: '#ffa726',
            fontSize: isMobile ? 20 : 28,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0)',
            transition: '0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'drop-shadow(0 0 6px rgba(255,167,38,0.6))',
          }}
        />
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: TOKEN.fontDisplay,
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            mb: 0.5,
          }}
        >
          {member.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: TOKEN.fontBody,
            fontWeight: 600,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: TOKEN.gradientMain,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
          }}
        >
          {member.role}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: TOKEN.fontBody,
            fontSize: '0.88rem',
            lineHeight: 1.65,
            color: 'text.secondary',
          }}
        >
          {member.description}
        </Typography>
      </Box>
    </Card>
  );
};

export default TeamCard;
