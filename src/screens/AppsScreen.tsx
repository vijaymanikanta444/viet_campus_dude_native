import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppsBottomSheet } from '../components/AppsBottomSheet/AppsBottomSheet';
import { MainTabParamList } from '../navigation/types';

type AppsScreenNavigation = BottomTabNavigationProp<
  MainTabParamList,
  'AppsTab'
>;

export function AppsScreen() {
  const navigation = useNavigation<AppsScreenNavigation>();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // Open bottom sheet when AppsTab comes into focus
      setIsBottomSheetVisible(true);
      return () => {
        // Optional: cleanup when leaving the screen
      };
    }, []),
  );

  const handleClose = () => {
    setIsBottomSheetVisible(false);
    // Navigate back to previous tab (HomeTab)
    navigation.navigate('HomeTab');
  };

  return (
    <>
      <View style={{ flex: 1 }} />
      <AppsBottomSheet isVisible={isBottomSheetVisible} onClose={handleClose} />
    </>
  );
}
