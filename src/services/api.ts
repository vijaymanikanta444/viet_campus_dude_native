import type { UserProfile } from './authService';

export type BannerType = 'EVENT' | 'ANNOUNCEMENT';

export type Banner = {
  id: string;
  imageUrl: string;
  type: BannerType;
  redirectId: string;
};

export type TodaySummary = {
  classesToday: number;
  assignmentsDue: number;
};

export type DashboardSummary = {
  attendance: number;
  pendingAssignments: number;
  cgpa: number;
  feesDue: number;
};

export type AlertItem = {
  id: string;
  message: string;
};

export type EventItem = {
  id: string;
  title: string;
  dateLabel: string;
  venue: string;
};

export function getGreetingByTime() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 17) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
}

export function getDisplayName(profile: UserProfile | null, email: string | null) {
  if (profile) {
    return `${profile.firstName} ${profile.lastName}`.trim();
  }

  if (email) {
    const localPart = email.split('@')[0] ?? 'Student';
    const [firstPart = 'Student', lastPart = ''] = localPart
      .split(/[._-]/)
      .filter(Boolean);

    const firstName =
      firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
    const lastName =
      lastPart.charAt(0).toUpperCase() + lastPart.slice(1).toLowerCase();

    return `${firstName} ${lastName}`.trim();
  }

  return 'Student';
}