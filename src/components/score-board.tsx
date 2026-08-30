import {
  Button,
  Column,
  Host,
  Row,
  Text,
} from '@expo/ui';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text as RNText, useColorScheme, View } from 'react-native';

import { AnimatedScore } from '@/components/animated-score';
import { FeltButton } from '@/components/felt-button';
import { ResetSheet } from '@/components/reset-sheet';
import { PartidaHistory } from '@/components/partida-history';
import { VictoryOverlay } from '@/components/victory-overlay';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useTrucoGame, type PointValue, type Team } from '@/hooks/use-truco-game';

const POINT_VALUES: PointValue[] = [1, 2, 4];

function TeamColumn({
  label,
  score,
  color,
  disabled,
  onAddPoints,
}: {
  label: string;
  score: number;
  color: string;
  disabled: boolean;
  onAddPoints: (points: PointValue) => void;
}) {
  return (
    <View style={styles.teamColumn}>
      <Host matchContents>
        <Column alignment="center" spacing={Spacing.two}>
          <Text textStyle={{ color, fontSize: 18, fontWeight: '600' }}>{label}</Text>
        </Column>
      </Host>
      <AnimatedScore color={color} score={score} />
      <Host colorScheme="dark" matchContents seedColor={color}>
        <Row spacing={Spacing.two}>
          {POINT_VALUES.map((points) => (
            <Button
              key={points}
              disabled={disabled}
              label={`+${points}`}
              onPress={() => onAddPoints(points)}
              style={{ borderRadius: 999 }}
              variant="filled"
            />
          ))}
        </Row>
      </Host>
    </View>
  );
}

export function ScoreBoard() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const { us, them, partidas, winner, addPoints, undo, reset, canUndo, isGameOver } =
    useTrucoGame();
  const [resetSheetOpen, setResetSheetOpen] = useState(false);

  const handleAddPoints = (team: Team) => (points: PointValue) => {
    addPoints(team, points);
  };

  const handleConfirmReset = () => {
    reset();
    setResetSheetOpen(false);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.felt }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.scoreRow}>
          <TeamColumn
            color={colors.teamUs}
            disabled={isGameOver}
            label="Nós"
            onAddPoints={handleAddPoints('us')}
            score={us}
          />
          <View style={styles.divider} />
          <TeamColumn
            color={colors.teamThem}
            disabled={isGameOver}
            label="Eles"
            onAddPoints={handleAddPoints('them')}
            score={them}
          />
        </View>

        <View style={styles.historySection}>
          <RNText
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: Typography.sectionTitle.fontSize,
                fontWeight: Typography.sectionTitle.fontWeight,
                letterSpacing: Typography.sectionTitle.letterSpacing,
              },
            ]}>
            Partidas
          </RNText>

          <PartidaHistory colors={colors} partidas={partidas} />

          <View style={styles.actionsRow}>
            <FeltButton
              colors={colors}
              disabled={!canUndo}
              label="Desfazer"
              onPress={undo}
              style={styles.actionButton}
              variant="outlined"
            />
            <FeltButton
              colors={colors}
              label="Nova partida"
              onPress={() => setResetSheetOpen(true)}
              variant="text"
            />
          </View>
        </View>
      </ScrollView>

      <ResetSheet
        colors={colors}
        onCancel={() => setResetSheetOpen(false)}
        onConfirm={handleConfirmReset}
        visible={resetSheetOpen}
      />

      {winner ? (
        <VictoryOverlay
          colorScheme={scheme}
          onNewGame={() => {
            reset();
            setResetSheetOpen(false);
          }}
          winner={winner}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  host: {
    width: '100%',
  },
  historySection: {
    gap: Spacing.three,
    marginTop: Spacing.four,
    width: '100%',
  },
  sectionTitle: {
    textTransform: 'uppercase',
  },
  actionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    paddingTop: Spacing.three,
  },
  teamColumn: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.two,
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: Spacing.three,
    width: 1,
  },
});
