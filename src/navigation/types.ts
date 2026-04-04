import type { NavigatorScreenParams } from '@react-navigation/native';

export type ProfileSectionItem = {
  label: string;
  value?: string;
  description?: string;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ProfileSection: {
    title: string;
    subtitle?: string;
    items: ProfileSectionItem[];
  };
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  EventsTab: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
  AppsTab: undefined;
};
