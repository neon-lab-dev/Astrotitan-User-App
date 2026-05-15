import React, {
    JSX,
    useEffect,
    useRef,
} from "react";

import {
    Animated,
    StyleSheet,
    View,
} from "react-native";

type SkeletonLoaderProps = {
  width: number | string;
  height: number;

  innerSkeleton?: JSX.Element;

  borderRadius?: number;

  direction?: "row" | "column";

  array?: number[];
};

const SkeletonLoader = ({
  width,
  height,
  innerSkeleton,
  borderRadius = 16,
  direction = "column",
  array = [1, 2, 3],
}: SkeletonLoaderProps) => {
  /* ---------------- ANIMATION ---------------- */

  const shimmerValue =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          shimmerValue,
          {
            toValue: 1,

            duration: 900,

            useNativeDriver: true,
          }
        ),

        Animated.timing(
          shimmerValue,
          {
            toValue: 0,

            duration: 900,

            useNativeDriver: true,
          }
        ),
      ])
    ).start();
  }, []);

  /* ---------------- OPACITY ---------------- */

  const opacity =
    shimmerValue.interpolate({
      inputRange: [0, 1],

      outputRange: [0.45, 1],
    });

  return (
    <View
      style={{
        flexDirection: direction,

        gap: 14,
      }}
    >
      {array.map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.skeleton,{width,height,borderRadius,opacity,},
          ]}
        >
          {innerSkeleton}
        </Animated.View>
      ))}
    </View>
  );
};

export default SkeletonLoader;

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E7D7A8",

    overflow: "hidden",

    borderWidth: 1,

    borderColor:
      "rgba(212,175,55,0.15)",
  },
});