import { useCallback, useReducer } from 'react';

import { WIN_SCORE } from '@/constants/theme';

export type Team = 'us' | 'them';
export type PointValue = 1 | 2 | 4;

export type Move = {
  id: string;
  team: Team;
  points: PointValue;
  usTotal: number;
  themTotal: number;
};

export type Partida = {
  id: string;
  winner: Team;
  us: number;
  them: number;
};

type GameState = {
  us: number;
  them: number;
  moves: Move[];
  partidas: Partida[];
  winner: Team | null;
};

type GameAction =
  | { type: 'ADD_POINTS'; team: Team; points: PointValue }
  | { type: 'UNDO' }
  | { type: 'RESET' };

const initialState: GameState = {
  us: 0,
  them: 0,
  moves: [],
  partidas: [],
  winner: null,
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_POINTS': {
      if (state.winner) return state;

      const us = action.team === 'us' ? state.us + action.points : state.us;
      const them = action.team === 'them' ? state.them + action.points : state.them;

      const move: Move = {
        id: createId(),
        team: action.team,
        points: action.points,
        usTotal: us,
        themTotal: them,
      };

      let winner: Team | null = null;
      if (us >= WIN_SCORE) winner = 'us';
      else if (them >= WIN_SCORE) winner = 'them';

      const partidas = winner
        ? [
            ...state.partidas,
            {
              id: createId(),
              winner,
              us,
              them,
            },
          ]
        : state.partidas;

      return {
        us,
        them,
        moves: [...state.moves, move],
        partidas,
        winner,
      };
    }
    case 'UNDO': {
      if (state.moves.length === 0) return state;

      const newMoves = state.moves.slice(0, -1);
      const lastMove = newMoves.at(-1);
      const hadWinner = state.winner !== null;

      return {
        us: lastMove?.usTotal ?? 0,
        them: lastMove?.themTotal ?? 0,
        moves: newMoves,
        partidas: hadWinner ? state.partidas.slice(0, -1) : state.partidas,
        winner: null,
      };
    }
    case 'RESET':
      return {
        ...initialState,
        partidas: state.partidas,
      };
    default:
      return state;
  }
}

export function useTrucoGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const addPoints = useCallback((team: Team, points: PointValue) => {
    dispatch({ type: 'ADD_POINTS', team, points });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    addPoints,
    undo,
    reset,
    canUndo: state.moves.length > 0,
    isGameOver: state.winner !== null,
  };
}
