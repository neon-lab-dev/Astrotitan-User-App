// src/components/layout/AnimatedScreen.tsx

import { usePathname } from "expo-router";
import { ReactNode, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";

type Props = {
  children: ReactNode;
  delay?: number;
};

export default function AnimatedScreen({ children, delay = 0 }: Props) {
  const pathname = usePathname();

  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = 40;
    opacity.value = 0;

    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      })
    );

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 600,
      })
    );
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}