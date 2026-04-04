import React, { memo } from 'react';

import CalendarFilledIcon from '../../assets/icons/calendar-filled.svg';
import CalendarOutlineIcon from '../../assets/icons/calendar.svg';
import ChevronRightIcon from '../../assets/icons/chevron-right.svg';
import DashboardFilledIcon from '../../assets/icons/dashboard-filled.svg';
import DashboardOutlineIcon from '../../assets/icons/dashboard.svg';
import HomeFilledIcon from '../../assets/icons/home-filled.svg';
import HomeOutlineIcon from '../../assets/icons/home.svg';
import ProfileFilledIcon from '../../assets/icons/profile-filled.svg';
import ProfileOutlineIcon from '../../assets/icons/profile.svg';
import { useTheme } from '../../theme';

const iconMap = {
  calendar: {
    filled: CalendarFilledIcon,
    outline: CalendarOutlineIcon,
  },
  'chevron-right': {
    filled: ChevronRightIcon,
    outline: ChevronRightIcon,
  },
  dashboard: {
    filled: DashboardFilledIcon,
    outline: DashboardOutlineIcon,
  },
  home: {
    filled: HomeFilledIcon,
    outline: HomeOutlineIcon,
  },
  profile: {
    filled: ProfileFilledIcon,
    outline: ProfileOutlineIcon,
  },
} as const;

export type IconName = keyof typeof iconMap;
export type IconVariant = 'outline' | 'filled';

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  active?: boolean;
  variant?: IconVariant;
};

function IconBase({
  name,
  size = 24,
  color,
  active = false,
  variant,
}: IconProps) {
  const { theme } = useTheme();
  const resolvedVariant = variant ?? (active ? 'filled' : 'outline');
  const SvgIcon = iconMap[name][resolvedVariant];
  const resolvedColor = color ?? theme.colors.textPrimary;

  return <SvgIcon width={size} height={size} color={resolvedColor} />;
}

export const Icon = memo(IconBase);
