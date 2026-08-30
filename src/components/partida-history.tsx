import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import type { Partida } from '@/hooks/use-truco-game';

type Scheme = keyof typeof Colors;
type Palette = (typeof Colors)[Scheme];

type PartidaHistoryProps = {
  partidas: Partida[];
  colors: Palette;
};

function teamLabel(team: Partida['winner']) {
  return team === 'us' ? 'Nós' : 'Eles';
}

function teamColor(team: Partida['winner'], colors: Palette) {
  return team === 'us' ? colors.teamUs : colors.teamThem;
}

export function PartidaHistory({ partidas, colors }: PartidaHistoryProps) {
  if (partidas.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.textMuted }]}>
        Nenhuma partida registrada ainda.
      </Text>
    );
  }

  const reversed = [...partidas].reverse();

  return (
    <View style={styles.list}>
      {reversed.map((partida, reverseIndex) => {
        const index = partidas.length - reverseIndex;
        const tint = teamColor(partida.winner, colors);

        return (
          <View
            key={partida.id}
            style={[
              styles.row,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}>
            <Text style={[styles.index, { color: colors.textMuted }]}>{`#${index}`}</Text>

            <View style={styles.main}>
              <Text style={[styles.winner, { color: tint }]}>{teamLabel(partida.winner)}</Text>
              <Text style={[styles.score, { color: colors.textSecondary }]}>
                {`${partida.us} × ${partida.them}`}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  empty: {
    fontSize: 15,
    lineHeight: 21,
  },
  row: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  index: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
    width: 28,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  winner: {
    fontSize: 16,
    fontWeight: '600',
  },
  score: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
});
