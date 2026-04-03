import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TOKEN } from '../constants';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const StatItem: React.FC<StatItemProps> = ({
                                               value,
                                               label,
                                               suffix = '',
                                               duration = 2000,
                                           }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (hasAnimated) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;

                setHasAnimated(true);
                observer.unobserve(el);

                let startTime: number | null = null;

                const animate = (currentTime: number) => {
                    if (!startTime) startTime = currentTime;

                    const progress = Math.min((currentTime - startTime) / duration, 1);

                    const currentValue = Math.floor(progress * value);
                    setCount(currentValue);

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        setCount(value);
                    }
                };

                requestAnimationFrame(animate);
            },
            { threshold: 0.2 }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [value, duration, hasAnimated]);

  return (
    <Box
      id={`stat-${label}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      sx={{
        textAlign: 'center',
        py: 4,
        px: 2,
        borderRadius: TOKEN.radiusMd,
        position: 'relative',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: TOKEN.transition,
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: hovered ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
          width: 48,
          height: 3,
          background: TOKEN.gradientMain,
          borderRadius: 2,
          transition: TOKEN.transition,
        },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: TOKEN.fontDisplay,
          fontWeight: 800,
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          background: TOKEN.gradient135,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 1,
          lineHeight: 1,
        }}
      >
        {count}{suffix}
      </Typography>
      <Typography
        sx={{
          fontFamily: TOKEN.fontBody,
          fontWeight: 500,
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'text.secondary',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default StatItem;
