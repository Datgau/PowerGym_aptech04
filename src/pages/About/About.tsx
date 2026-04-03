import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import PowerGymLayout from '../../components/PowerGym/Layout/PowerGymLayout';
import { injectFonts, TOKEN } from './constants';
import { valuesData, teamData, statsData, storyImages } from './data';
import HeroSection from './sections/HeroSection';
import StorySection from './sections/StorySection';
import StatisticsSection from './sections/StatisticsSection';
import ValuesSection from './sections/ValuesSection';
import TeamSection from './sections/TeamSection';
import CTASection from './sections/CTASection';

const About: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    injectFonts();
    setShow(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PowerGymLayout>
      <Box sx={{ fontFamily: TOKEN.fontBody, overflowX: 'hidden' }}>
        <HeroSection show={show} scrolled={scrolled} onNavigate={handleNavigate} />
        <StorySection show={show} images={storyImages} />
        <StatisticsSection stats={statsData} />
        <ValuesSection show={show} values={valuesData} />
        <TeamSection show={show} team={teamData} isMobile={isMobile} />
        <CTASection show={show} onNavigate={handleNavigate} />
      </Box>
    </PowerGymLayout>
  );
};

export default About;
