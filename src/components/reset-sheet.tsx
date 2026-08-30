import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { FeltButton } from '@/components/felt-button';
import { Colors, Spacing } from '@/constants/theme';

type Scheme = keyof typeof Colors;
type Palette = (typeof Colors)[Scheme];

type ResetSheetProps = {
  visible: boolean;
  colors: Palette;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ResetSheet({ visible, colors, onCancel, onConfirm }: ResetSheetProps) {
  return (
    <Modal animationType="slide" onRequestClose={onCancel} transparent visible={visible}>
      <View style={styles.root}>
        <Pressable accessibilityRole="button" onPress={onCancel} style={styles.backdrop} />

        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <Text style={[styles.title, { color: colors.text }]}>Nova partida?</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            O placar atual será zerado.
          </Text>

          <View style={styles.actions}>
            <FeltButton
              colors={colors}
              label="Cancelar"
              onPress={onCancel}
              style={styles.sheetButton}
              variant="outlined"
            />
            <FeltButton
              colors={colors}
              label="Confirmar"
              onPress={onConfirm}
              style={styles.sheetButton}
              variant="filled"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    borderCurve: 'continuous',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    gap: Spacing.two,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  grabber: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 4,
    marginBottom: Spacing.one,
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  sheetButton: {
    flex: 1,
  },
});
