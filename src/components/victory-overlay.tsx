import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing } from '@/constants/theme';
import type { Team } from '@/hooks/use-truco-game';

type VictoryOverlayProps = {
  winner: Team;
  colorScheme: 'light' | 'dark';
  onNewGame: () => void;
};

async function triggerVictoryHaptic() {
  if (process.env.EXPO_OS === 'ios') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

function PulseRing({ delay, color }: { delay: number; color: string }) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;

    progress.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 0 })),
          -1,
        ),
      ),
    );
  }, [delay, progress, reducedMotion]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: (1 - progress.get()) * 0.45,
    transform: [{ scale: 0.9 + progress.get() * 0.6 }],
  }));

  if (reducedMotion) return null;

  return <Animated.View style={[styles.ring, ringStyle, { borderColor: color }]} />;
}

export function VictoryOverlay({ winner, colorScheme, onNewGame }: VictoryOverlayProps) {
  const colors = Colors[colorScheme];
  const teamColor = winner === 'us' ? colors.teamUs : colors.teamThem;
  const teamName = winner === 'us' ? 'Nós' : 'Eles';
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    void triggerVictoryHaptic();
  }, []);

  const cardEntering = reducedMotion ? FadeIn : ZoomIn.springify().damping(14);

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.overlay}>
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]} />

      <PulseRing color={teamColor} delay={0} />
      <PulseRing color={teamColor} delay={600} />
      <PulseRing color={teamColor} delay={1200} />

      <Animated.View entering={cardEntering} style={[styles.card, { borderColor: teamColor }]}>
        {Platform.OS === 'ios' ? (
          <Image source="sf:trophy.fill" style={styles.trophy} tintColor={teamColor} />
        ) : (
          <Text style={[styles.trophyEmoji, { color: teamColor }]}>🏆</Text>
        )}

        <Text style={styles.title}>{`${teamName} venceram!`}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          12 tentos — parabéns!
        </Text>

        <Pressable
          onPress={onNewGame}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonLabel}>Nova partida</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  ring: {
    borderRadius: 999,
    borderWidth: 2,
    height: 220,
    position: 'absolute',
    width: 220,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderCurve: 'continuous',
    borderRadius: 24,
    borderWidth: 2,
    gap: Spacing.two,
    maxWidth: 320,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    width: '85%',
  },
  trophy: {
    height: 56,
    width: 56,
  },
  trophyEmoji: {
    fontSize: 56,
    lineHeight: 64,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderCurve: 'continuous',
    borderRadius: 12,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonLabel: {
    color: '#1B4332',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
