import { Color } from 'expo-router';
import { Platform } from 'react-native';

export const WIN_SCORE = 12;

export const Colors = {
  light: {
    felt: '#1B4332',
    feltMuted: '#2D6A4F',
    surface: '#24543F',
    surfaceElevated: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.22)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    textMuted: 'rgba(255, 255, 255, 0.55)',
    teamUs: '#74C0FC',
    teamThem: '#FF8787',
    accent: '#74C0FC',
    buttonFilledText: '#0D2818',
    overlay: 'rgba(0, 0, 0, 0.55)',
    label: Platform.select({
      ios: Color.ios.label,
      android: Color.android.dynamic.onSurface,
      default: '#FFFFFF',
    }),
  },
  dark: {
    felt: '#0D2818',
    feltMuted: '#1B4332',
    surface: '#163D2A',
    surfaceElevated: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.18)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    teamUs: '#74C0FC',
    teamThem: '#FF8787',
    accent: '#74C0FC',
    buttonFilledText: '#0D2818',
    overlay: 'rgba(0, 0, 0, 0.65)',
    label: Platform.select({
      ios: Color.ios.label,
      android: Color.android.dynamic.onSurface,
      default: '#FFFFFF',
    }),
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Typography = {
  score: {
    fontSize: 72,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as ('tabular-nums')[],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.6,
  },
} as const;

export const Motion = {
  scoreEnter: 200,
  scorePulse: { duration: 400, dampingRatio: 0.8 },
  victoryEnter: 500,
} as const;
