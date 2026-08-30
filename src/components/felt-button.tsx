import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

type Scheme = keyof typeof Colors;
type Palette = (typeof Colors)[Scheme];

type FeltButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'text';
  colors: Palette;
  style?: StyleProp<ViewStyle>;
};

export function FeltButton({
  label,
  onPress,
  disabled = false,
  variant = 'filled',
  colors,
  style,
}: FeltButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'filled' && { backgroundColor: colors.accent },
        variant === 'outlined' && {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          borderWidth: 1,
        },
        variant === 'text' && styles.textVariant,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          variant === 'filled' && { color: colors.buttonFilledText },
          variant !== 'filled' && { color: colors.accent },
          disabled && { color: colors.textMuted },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  textVariant: {
    backgroundColor: 'transparent',
    minHeight: 40,
    paddingHorizontal: Spacing.two,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
