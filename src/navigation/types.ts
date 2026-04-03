import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  EventsTab: undefined;
  ProfileTab: undefined;
  AppsTab: undefined;
};
