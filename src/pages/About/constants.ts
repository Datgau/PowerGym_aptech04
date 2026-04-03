// Design Tokens
export const TOKEN = {
  gradientMain: 'linear-gradient(90deg, #00b4ff, #0066ff)',
  gradient135: 'linear-gradient(135deg, #00b4ff, #0066ff)',
  gradientDark: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)',
  gradientSurface: 'linear-gradient(135deg, #f4f7fb 0%, #e8edf5 100%)',
  navy: '#0a1929',
  navyMid: '#1a2332',
  blueStart: '#00b4ff',
  blueEnd: '#0066ff',
  glowSm: '0 4px 24px rgba(0,180,255,0.25)',
  glowMd: '0 12px 48px rgba(0,180,255,0.35)',
  glowLg: '0 24px 80px rgba(0,180,255,0.45)',
  radiusMd: '20px',
  radiusLg: '32px',
  transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  fontDisplay: "'Oswald', sans-serif",
  fontBody: "'Barlow', sans-serif",
} as const;

// Google Fonts injection
export const injectFonts = () => {
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href =
    'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Barlow:wght@300;400;500;600;700&display=swap';
  if (!document.head.querySelector('[href*="Oswald"]')) {
    document.head.appendChild(fontLink);
  }
};

// Button styles
export const gradientBtnSx = {
  fontFamily: TOKEN.fontDisplay,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  borderRadius: '4px',
  px: 5,
  py: 1.75,
  fontSize: '1rem',
  fontWeight: 700,
  background: TOKEN.gradient135,
  boxShadow: TOKEN.glowSm,
  transition: TOKEN.transition,
  '&:hover': {
    background: 'linear-gradient(135deg, #0066ff, #00b4ff)',
    transform: 'translateY(-4px)',
    boxShadow: TOKEN.glowMd,
  },
};

export const outlinedBtnSx = {
  fontFamily: TOKEN.fontDisplay,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  borderRadius: '4px',
  px: 5,
  py: 1.75,
  fontSize: '1rem',
  fontWeight: 700,
  borderColor: 'white',
  borderWidth: 2,
  color: 'white',
  transition: TOKEN.transition,
  '&:hover': {
    borderWidth: 2,
    borderColor: TOKEN.blueStart,
    background: 'rgba(0,180,255,0.1)',
    transform: 'translateY(-4px)',
  },
};
