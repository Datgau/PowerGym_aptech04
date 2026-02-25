// Admin Dashboard Mock Data
export const adminMockData = {
  // Dashboard Stats
  stats: {
    totalMembers: 1247,
    activeMembers: 1089,
    totalRevenue: 2450000000,
    monthlyRevenue: 245000000,
    newMembersThisMonth: 87,
    equipmentCount: 156,
    trainersCount: 24,
    servicesCount: 12
  },

  // Members Data
  members: [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      phone: '0901234567',
      membershipType: 'Premium',
      joinDate: '2024-01-15',
      expiryDate: '2024-12-15',
      status: 'active',
      avatar: '/images/avatar1.jpg',
      totalSessions: 45,
      lastVisit: '2024-02-01'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      email: 'binh.tran@email.com',
      phone: '0912345678',
      membershipType: 'Basic',
      joinDate: '2024-02-01',
      expiryDate: '2024-08-01',
      status: 'active',
      avatar: '/images/avatar2.jpg',
      totalSessions: 23,
      lastVisit: '2024-02-02'
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      email: 'cuong.le@email.com',
      phone: '0923456789',
      membershipType: 'VIP',
      joinDate: '2023-12-10',
      expiryDate: '2024-12-10',
      status: 'expired',
      avatar: '/images/avatar3.jpg',
      totalSessions: 78,
      lastVisit: '2024-01-28'
    }
  ],

  // Trainers Data
  trainers: [
    {
      id: '1',
      name: 'Phạm Văn Đức',
      email: 'duc.pham@powergym.com',
      phone: '0934567890',
      specialization: 'Bodybuilding',
      experience: '5 năm',
      rating: 4.8,
      clients: 25,
      status: 'active',
      avatar: '/images/trainer1.jpg',
      certifications: ['ACSM', 'NASM'],
      salary: 15000000
    },
    {
      id: '2',
      name: 'Nguyễn Thị Hoa',
      email: 'hoa.nguyen@powergym.com',
      phone: '0945678901',
      specialization: 'Yoga & Pilates',
      experience: '3 năm',
      rating: 4.9,
      clients: 30,
      status: 'active',
      avatar: '/images/trainer2.jpg',
      certifications: ['RYT-200', 'Pilates'],
      salary: 12000000
    }
  ],

  // Equipment Data
  equipment: [
    {
      id: '1',
      name: 'Máy chạy bộ Technogym',
      category: 'Cardio',
      brand: 'Technogym',
      model: 'Run Now',
      purchaseDate: '2023-06-15',
      warranty: '2025-06-15',
      status: 'active',
      maintenanceDate: '2024-01-15',
      cost: 85000000,
      location: 'Khu vực Cardio A'
    },
    {
      id: '2',
      name: 'Ghế tập ngực',
      category: 'Strength',
      brand: 'Life Fitness',
      model: 'Signature Series',
      purchaseDate: '2023-08-20',
      warranty: '2026-08-20',
      status: 'maintenance',
      maintenanceDate: '2024-02-01',
      cost: 45000000,
      location: 'Khu vực tạ A'
    }
  ],

  // Services Data
  services: [
    {
      id: '1',
      name: 'Personal Training',
      category: 'Training',
      price: 500000,
      duration: 60,
      maxParticipants: 1,
      description: 'Huấn luyện cá nhân 1-1 với PT chuyên nghiệp',
      isActive: true,
      bookings: 45,
      revenue: 22500000
    },
    {
      id: '2',
      name: 'Group Fitness',
      category: 'Class',
      price: 150000,
      duration: 45,
      maxParticipants: 20,
      description: 'Lớp tập thể dục nhóm với nhiều bài tập đa dạng',
      isActive: true,
      bookings: 120,
      revenue: 18000000
    }
  ],

  // Membership Packages
  membershipPackages: [
    {
      id: '1',
      name: 'Basic',
      price: 800000,
      duration: 30,
      features: ['Sử dụng thiết bị cơ bản', 'Tủ khóa', 'Wifi miễn phí'],
      isActive: true,
      subscribers: 450,
      revenue: 360000000
    },
    {
      id: '2',
      name: 'Premium',
      price: 1500000,
      duration: 30,
      features: ['Tất cả thiết bị', 'Group classes', 'Sauna', 'Massage'],
      isActive: true,
      subscribers: 320,
      revenue: 480000000
    },
    {
      id: '3',
      name: 'VIP',
      price: 2500000,
      duration: 30,
      features: ['Tất cả dịch vụ', 'Personal trainer', 'Dinh dưỡng tư vấn', 'Spa'],
      isActive: true,
      subscribers: 180,
      revenue: 450000000
    }
  ],

  // Financial Data
  financial: {
    monthlyRevenue: [
      { month: 'T1', revenue: 220000000, expenses: 150000000 },
      { month: 'T2', revenue: 245000000, expenses: 160000000 },
      { month: 'T3', revenue: 280000000, expenses: 170000000 },
      { month: 'T4', revenue: 310000000, expenses: 180000000 },
      { month: 'T5', revenue: 295000000, expenses: 175000000 },
      { month: 'T6', revenue: 320000000, expenses: 185000000 }
    ],
    expenses: [
      { category: 'Lương nhân viên', amount: 120000000, percentage: 35 },
      { category: 'Tiền thuê mặt bằng', amount: 80000000, percentage: 23 },
      { category: 'Điện nước', amount: 45000000, percentage: 13 },
      { category: 'Bảo trì thiết bị', amount: 35000000, percentage: 10 },
      { category: 'Marketing', amount: 25000000, percentage: 7 },
      { category: 'Khác', amount: 40000000, percentage: 12 }
    ]
  },

  // Bookings/Schedule Data
  bookings: [
    {
      id: '1',
      memberName: 'Nguyễn Văn An',
      serviceName: 'Personal Training',
      trainerName: 'Phạm Văn Đức',
      date: '2024-02-05',
      time: '09:00',
      status: 'confirmed',
      price: 500000
    },
    {
      id: '2',
      memberName: 'Trần Thị Bình',
      serviceName: 'Group Fitness',
      trainerName: 'Nguyễn Thị Hoa',
      date: '2024-02-05',
      time: '18:00',
      status: 'pending',
      price: 150000
    }
  ],

  // Reports Data
  reports: {
    membershipGrowth: [
      { month: 'T1', newMembers: 65, canceledMembers: 12 },
      { month: 'T2', newMembers: 78, canceledMembers: 15 },
      { month: 'T3', newMembers: 92, canceledMembers: 8 },
      { month: 'T4', newMembers: 87, canceledMembers: 18 },
      { month: 'T5', newMembers: 95, canceledMembers: 10 },
      { month: 'T6', newMembers: 103, canceledMembers: 14 }
    ],
    popularServices: [
      { name: 'Personal Training', bookings: 245, revenue: 122500000 },
      { name: 'Group Fitness', bookings: 420, revenue: 63000000 },
      { name: 'Yoga Classes', bookings: 380, revenue: 57000000 },
      { name: 'Swimming', bookings: 156, revenue: 31200000 }
    ]
  },

  // Settings Data
  settings: {
    gymInfo: {
      name: 'PowerGym',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '028-1234-5678',
      email: 'info@powergym.com',
      website: 'www.powergym.com',
      openTime: '05:00',
      closeTime: '23:00'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      membershipExpiry: 7, // days before expiry
      paymentReminder: 3 // days before payment due
    }
  }
};

export type AdminStats = typeof adminMockData.stats;
export type Member = typeof adminMockData.members[0];
export type Trainer = typeof adminMockData.trainers[0];
export type Equipment = typeof adminMockData.equipment[0];
export type Service = typeof adminMockData.services[0];
export type MembershipPackage = typeof adminMockData.membershipPackages[0];
export type Booking = typeof adminMockData.bookings[0];