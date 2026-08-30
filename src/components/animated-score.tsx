import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Motion, Typography } from '@/constants/theme';

type AnimatedScoreProps = {
  score: number;
  color: string;
};

async function triggerScoreHaptic() {
  if (process.env.EXPO_OS === 'ios') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export function AnimatedScore({ score, color }: AnimatedScoreProps) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (score === 0) return;

    if (!reducedMotion) {
      scale.set(withSpring(1.08, Motion.scorePulse));
      const timeout = setTimeout(() => {
        scale.set(withSpring(1, Motion.scorePulse));
      }, Motion.scoreEnter);
      return () => clearTimeout(timeout);
    }
  }, [score, reducedMotion, scale]);

  useEffect(() => {
    if (score > 0) {
      void triggerScoreHaptic();
    }
  }, [score]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const entering = reducedMotion ? undefined : SlideInUp.springify().damping(18);
  const exiting = reducedMotion ? undefined : SlideOutUp.duration(Motion.scoreEnter);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Text
        key={score}
        entering={entering}
        exiting={exiting}
        style={[styles.score, Typography.score, { color }]}>
        {score}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 88,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  score: {
    includeFontPadding: false,
    lineHeight: 80,
    textAlign: 'center',
  },
});
