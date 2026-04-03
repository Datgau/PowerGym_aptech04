import React from 'react';
import {
  FitnessCenter,
  EmojiEvents,
  Favorite,
  Groups,
} from '@mui/icons-material';
import type { ValueItem, TeamMember, StatItemData, ImageData } from './types';
import datImg from '../../../public/images/dat1.png';


export const valuesData: ValueItem[] = [
  {
    icon: React.createElement(FitnessCenter, { sx: { fontSize: 44 } }),
    title: 'Top Quality',
    description: 'Modern equipment and professional trainers',
    color: '#00b4ff',
  },
  {
    icon: React.createElement(Favorite, { sx: { fontSize: 44 } }),
    title: 'Customer-Centric',
    description: 'We always put your health and goals first',
    color: '#ff4444',
  },
  {
    icon: React.createElement(Groups, { sx: { fontSize: 44 } }),
    title: 'Strong Community',
    description: 'A positive space to keep you motivated and connected',
    color: '#4caf50',
  },
  {
    icon: React.createElement(EmojiEvents, { sx: { fontSize: 44 } }),
    title: 'Results Driven',
    description: 'Scientific training methods with clear progress tracking',
    color: '#ffa726',
  },
];

export const teamData: TeamMember[] = [
  {
    name: 'Nguyen Tien Dat',
    role: 'Chief Executive Officer',
    image: datImg,
    description: '15 years of experience in the fitness industry',
  },
  {
    name: 'Tran Ngoc Anh',
    role: 'Head of Training',
    image: 'https://i.pravatar.cc/300?img=45',
    description: 'International certified PT and nutrition expert',
  },
  {
    name: 'Tran Cong Nghia',
    role: 'Head Coach',
    image: 'https://i.pravatar.cc/300?img=33',
    description: 'Vietnam Bodybuilding Champion 2020',
  },
  {
    name: 'Truong Trung Dung',
    role: 'Yoga & Pilates Specialist',
    image: 'https://i.pravatar.cc/300?img=47',
    description: '10 years of professional yoga teaching experience',
  },
];

export const statsData: StatItemData[] = [
  { value: 10000, label: 'Members', suffix: '+' },
  { value: 50, label: 'Trainers', suffix: '+' },
  { value: 11, label: 'Years of Experience', suffix: '+' },
  { value: 98, label: 'Satisfaction Rate', suffix: '%' },
];

export const storyImages: ImageData[] = [
  {
    src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
    alt: 'PowerGym Facility',
  },
  {
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    alt: 'PowerGym Training',
  },
];