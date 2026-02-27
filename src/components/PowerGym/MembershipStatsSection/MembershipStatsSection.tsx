import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Skeleton,
  Button,
  Tooltip,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  FitnessCenter,
  CalendarToday,
  Schedule
} from '@mui/icons-material';
import type { MembershipStats } from '../../../@type/powergym';
import styles from './MembershipStatsSection.module.css';

interface MembershipStatsSectionProps {
  readonly membership: MembershipStats | null;
  readonly loading?: boolean;
}

const MembershipStatsSection: React.FC<MembershipStatsSectionProps> = ({
  membership,
  loading = false
}) => {
  if (loading) {
    return (
      <Box component="section" className={styles.membershipSection}>
        <Container maxWidth="md">
          <MembershipSkeleton />
        </Container>
      </Box>
    );
  }

  if (!membership) {
    return (
      <Box component="section" className={styles.membershipSection}>
        <Container maxWidth="md">
          <NoMembershipCard />
        </Container>
      </Box>
    );
  }

  return (
    <Box component="section" className={styles.membershipSection}>
      <Container maxWidth="md">
        <MembershipCard membership={membership} />
      </Container>
    </Box>
  );
};

interface MembershipCardProps {
  readonly membership: MembershipStats;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ membership }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          color: 'success' as const,
          icon: CheckCircle,
          text: 'ACTIVATED'
        };
      case 'EXPIRED':
        return {
          color: 'error' as const,
          icon: Error,
          text: 'EXPIRED'
        };
      case 'SUSPENDED':
        return {
          color: 'warning' as const,
          icon: Warning,
          text: 'SUSPENDED'
        };
      default:
        return {
          color: 'default' as const,
          icon: Warning,
          text: status
        };
    }
  };

  const statusConfig = getStatusConfig(membership.status);
  const progressPercentage = ((membership.totalDays - membership.daysLeft) / membership.totalDays) * 100;
  const isExpiringSoon = membership.daysLeft <= 7 && membership.isActive;

  return (
    <Card className={styles.membershipCard} elevation={3}
          sx={{
            fontWeight: 500,
            fontSize: { xs: '2rem', md: '2.5rem' },
            color: '#1a1a1a',
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
      <CardContent className={styles.cardContent}>
        <Box className={styles.cardHeader}>
          <Typography variant="h5" component="h2" className={styles.cardTitle}>
            Membership Contract
          </Typography>
          
          <Tooltip title={`Status: ${statusConfig.text}`} arrow>
            <Chip
              icon={<statusConfig.icon />}
              label={statusConfig.text}
              color={statusConfig.color}
              variant="filled"
              className={styles.statusChip}
            />
          </Tooltip>
        </Box>

        <Typography
          variant="h4"
          component="h2"
          className={styles.membershipType}
          gutterBottom
        >
          {membership.membershipType}
        </Typography>

        {isExpiringSoon && (
          <Alert severity="warning" className={styles.expiryAlert}>
            <AlertTitle>Expiring Soon</AlertTitle>
            Your membership will expire in {membership.daysLeft} days. 
            Please renew to continue using the service.
          </Alert>
        )}

        <Box className={styles.progressSection}>
          <Box className={styles.progressHeader}>
          <Typography variant="body2" color="text.secondary">
              Usage Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            className={styles.progressBar}
            color={isExpiringSoon ? 'warning' : 'primary'}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
          className={styles.statsGrid}
        >
          <StatItem
            icon={FitnessCenter}
            label="Trained"
            value={membership.totalDays - membership.daysLeft}
            unit="days"
            color="primary"
          />
          
          <StatItem
            icon={Schedule}
            label="Remaining"
            value={membership.daysLeft}
            unit="days"
            color={isExpiringSoon ? 'warning' : 'success'}
            highlight={isExpiringSoon}
          />
          
          <StatItem
            icon={CalendarToday}
            label="Expires"
            value={new Date(membership.expiryDate).toLocaleDateString('en-US')}
            color="info"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly value: string | number;
  readonly unit?: string;
  readonly color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  readonly highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  color = 'primary',
  highlight = false
}) => {
  return (
    <Card
      className={`${styles.statCard} ${highlight ? styles.highlightCard : ''}`}
      variant="outlined"
    >
      <CardContent className={styles.statContent}>
        <Box className={styles.statHeader}>
          <Icon color={color} />
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
        
        <Typography
          variant="h5"
          component="div"
          className={styles.statValue}
          color={highlight ? 'warning.main' : 'text.primary'}
        >
          {value} {unit && <span className={styles.statUnit}>{unit}</span>}
        </Typography>
      </CardContent>
    </Card>
  );
};

const NoMembershipCard: React.FC = () => {
  return (
    <Card className={styles.noMembershipCard} variant="outlined">
      <CardContent className={styles.noMembershipContent}>
        <FitnessCenter className={styles.noMembershipIcon} />
        
        <Typography variant="h5" component="h3" gutterBottom>
          No Membership Package
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Register for a membership package to start your training journey at PowerGym
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<FitnessCenter />}
        >
          View Packages
        </Button>
      </CardContent>
    </Card>
  );
};

const MembershipSkeleton: React.FC = () => {
  return (
    <Card className={styles.membershipCard}>
      <CardContent>
        <Box className={styles.cardHeader}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="rectangular" width={120} height={32} />
        </Box>
        
        <Skeleton variant="text" width={300} height={48} />
        <Skeleton variant="rectangular" width="100%" height={8} />
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)'
            },
            gap: 3,
            mt: 2
          }}
        >
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rectangular" width="100%" height={100} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MembershipStatsSection;