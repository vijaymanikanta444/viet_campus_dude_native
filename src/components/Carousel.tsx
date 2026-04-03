import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { useTheme } from '../theme';
import type { Banner } from '../services/api';

type CarouselProps = {
  data: Banner[];
  onPressItem: (item: Banner) => void;
  autoScrollIntervalMs?: number;
};

const BANNER_WIDTH_FACTOR = 0.92;

function CarouselBase({
  data,
  onPressItem,
  autoScrollIntervalMs = 3500,
}: CarouselProps) {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList<Banner>>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentVirtualIndexRef = useRef(0);

  const loopData = useMemo(() => {
    if (data.length <= 1) {
      return data;
    }

    return [data[data.length - 1], ...data, data[0]];
  }, [data]);

  const bannerWidth = useMemo(
    () => Math.max(1, containerWidth * BANNER_WIDTH_FACTOR),
    [containerWidth],
  );

  const bannerGap = theme.spacing.sm;

  useEffect(() => {
    if (!containerWidth || data.length <= 1) {
      currentVirtualIndexRef.current = 0;
      return;
    }

    currentVirtualIndexRef.current = 1;
    flatListRef.current?.scrollToIndex({
      index: 1,
      animated: false,
    });
  }, [containerWidth, data.length]);

  useEffect(() => {
    if (data.length <= 1 || !containerWidth) {
      return;
    }

    const timer = setInterval(() => {
      const nextVirtualIndex = currentVirtualIndexRef.current + 1;
      flatListRef.current?.scrollToIndex({
        index: nextVirtualIndex,
        animated: true,
      });
    }, autoScrollIntervalMs);

    return () => clearInterval(timer);
  }, [autoScrollIntervalMs, containerWidth, data.length]);

  const onMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!bannerWidth) {
        return;
      }

      const itemSpan = bannerWidth + bannerGap;
      const virtualIndex = Math.round(
        event.nativeEvent.contentOffset.x / itemSpan,
      );

      if (data.length <= 1) {
        currentVirtualIndexRef.current = virtualIndex;
        setActiveIndex(Math.max(0, Math.min(virtualIndex, data.length - 1)));
        return;
      }

      if (virtualIndex === 0) {
        const resetIndex = data.length;
        currentVirtualIndexRef.current = resetIndex;
        flatListRef.current?.scrollToIndex({
          index: resetIndex,
          animated: false,
        });
        setActiveIndex(data.length - 1);
        return;
      }

      if (virtualIndex === data.length + 1) {
        currentVirtualIndexRef.current = 1;
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
        setActiveIndex(0);
        return;
      }

      currentVirtualIndexRef.current = virtualIndex;
      setActiveIndex(virtualIndex - 1);
    },
    [bannerGap, bannerWidth, data.length],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Banner> | null | undefined, index: number) => ({
      index,
      length: bannerWidth + bannerGap,
      offset: (bannerWidth + bannerGap) * index,
    }),
    [bannerGap, bannerWidth],
  );

  const renderItem = useCallback(
    ({ item }: { item: Banner }) => (
      <Pressable
        style={[
          styles.banner,
          {
            width: bannerWidth,
            marginRight: bannerGap,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
        onPress={() => onPressItem(item)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
      </Pressable>
    ),
    [
      bannerGap,
      bannerWidth,
      onPressItem,
      theme.colors.border,
      theme.colors.surface,
    ],
  );

  return (
    <View onLayout={event => setContainerWidth(event.nativeEvent.layout.width)}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={loopData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsHorizontalScrollIndicator={false}
        snapToInterval={bannerWidth + bannerGap}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: theme.spacing.xs }}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumEnd}
      />

      <View style={styles.paginationRow}>
        {data.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <Pressable
              key={item.id}
              onPress={() => {
                if (data.length <= 1) {
                  currentVirtualIndexRef.current = index;
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                  setActiveIndex(index);
                  return;
                }

                const virtualIndex = index + 1;
                currentVirtualIndexRef.current = virtualIndex;
                flatListRef.current?.scrollToIndex({
                  index: virtualIndex,
                  animated: true,
                });
                setActiveIndex(index);
              }}
              style={[
                styles.dot,
                {
                  backgroundColor: isActive
                    ? theme.colors.primary
                    : theme.colors.border,
                  width: isActive ? 16 : 8,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  paginationRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

export const Carousel = memo(CarouselBase);
