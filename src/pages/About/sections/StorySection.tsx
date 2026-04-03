import React from 'react';
import { Box, Container, Typography, Fade } from '@mui/material';
import { TOKEN } from '../constants';
import SectionLabel from '../components/SectionLabel';
import type { ImageData } from '../types';

interface StorySectionProps {
  show: boolean;
  images: ImageData[];
}

const StorySection: React.FC<StorySectionProps> = ({ show, images }) => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <SectionLabel>Our Story</SectionLabel>
        <Typography
          variant="h2"
          sx={{
            fontFamily: TOKEN.fontDisplay,
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            mt: 2,
            mb: 3,
          }}
        >
            The Journey of PowerGym
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: TOKEN.fontBody,
            fontSize: '1.08rem',
            color: 'text.secondary',
            maxWidth: 780,
            mx: 'auto',
            lineHeight: 1.9,
          }}
        >
            Founded in 2015, PowerGym began as a small gym driven by a deep passion for helping people achieve their health and fitness goals. What started as a modest space with a handful of dedicated members has grown into a thriving fitness community built on motivation, discipline, and support. Over the years, we have continuously evolved—investing in modern equipment, expanding our facilities, and refining our training programs to meet the diverse needs of our members.

            Today, we are proud to be recognized as one of the leading fitness centers, serving over 10,000 members and supported by a team of highly skilled and professional trainers. At PowerGym, we believe fitness is more than just physical transformation—it’s about building confidence, improving overall well-being, and creating a strong, connected community. Our mission remains the same as day one: to empower every individual to push beyond their limits and become the best version of themselves.
        </Typography>

      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 8 }}>
        {images.map((img, i) => (
          <Box key={i} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
            <Fade in={show} timeout={1200 + i * 400}>
              <Box
                sx={{
                  height: { xs: 220, md: 400 },
                  borderRadius: TOKEN.radiusMd,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.14)',
                  position: 'relative',
                  '&:hover img': { transform: 'scale(1.05)' },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(0,180,255,0.18), rgba(0,102,255,0.18))',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box
                  component="img"
                  src={img.src}
                  alt={img.alt}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s ease',
                  }}
                />
              </Box>

            </Fade>
          </Box>

        ))}
      </Box>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
                variant="h4"
                sx={{
                    fontFamily: TOKEN.fontDisplay,
                    fontWeight: 700,
                    mb: 4,
                    textTransform: 'uppercase',
                }}
            >
                Achievements & Awards
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontFamily: TOKEN.fontBody,
                    fontSize: '1.05rem',
                    color: 'text.secondary',
                    maxWidth: 780,
                    mx: 'auto',
                    lineHeight: 1.9,
                    mt: 3,
                    mb:5
                }}
            >
                Throughout our journey, PowerGym has achieved significant milestones that reflect our commitment to excellence. We have proudly expanded our facilities, introduced innovative training programs, and built a strong community of fitness enthusiasts who inspire one another every day.

                Our dedication has been recognized through multiple industry awards and certifications, including “Top Fitness Center of the Year”, “Excellence in Customer Experience”, and professional trainer accreditations from leading fitness organizations. These achievements are a testament to the trust our members place in us and our relentless pursuit of quality and innovation.

                As we continue to grow, we remain focused on delivering exceptional fitness experiences, empowering individuals, and setting new standards in the fitness industry.
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: 'center',
                }}
            >
                {[
                    '🏆 Top Fitness Center of the Year',
                    '⭐ Excellence in Customer Experience',
                    '💪 Certified Professional Trainers',
                    '🔥 10,000+ Active Members',
                ].map((item, i) => (
                    <Fade in={show} timeout={1400 + i * 200} key={i}>
                        <Box
                            sx={{
                                px: 3,
                                py: 2,
                                borderRadius: 3,
                                background: 'rgba(0,180,255,0.08)',
                                border: '1px solid rgba(0,180,255,0.2)',
                                fontWeight: 500,
                                backdropFilter: 'blur(10px)',
                                transition: TOKEN.transition,
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 10px 30px rgba(0,180,255,0.2)',
                                },
                            }}
                        >
                            {item}
                        </Box>
                    </Fade>
                ))}
            </Box>

        </Box>
    </Container>
  );
};

export default StorySection;
