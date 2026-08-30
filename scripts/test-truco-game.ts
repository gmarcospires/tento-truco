/**
 * One-off smoke test for truco game logic.
 * Run: bun run scripts/test-truco-game.ts
 */

const WIN_SCORE = 12;

type Team = 'us' | 'them';
type PointValue = 1 | 2 | 4;

type Move = {
  id: string;
  team: Team;
  points: PointValue;
  usTotal: number;
  themTotal: number;
};

type Partida = {
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
  return `${Math.random().toString(36).slice(2, 9)}`;
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
        ? [...state.partidas, { id: createId(), winner, us, them }]
        : state.partidas;
      return { us, them, moves: [...state.moves, move], partidas, winner };
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
      return { ...initialState, partidas: state.partidas };
    default:
      return state;
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

let state = initialState;

state = gameReducer(state, { type: 'ADD_POINTS', team: 'us', points: 2 });
assert(state.us === 2 && state.them === 0, 'add us +2');
assert(state.moves[0].usTotal === 2, 'move partial us');
assert(state.partidas.length === 0, 'no partida mid-game');

state = gameReducer(state, { type: 'ADD_POINTS', team: 'them', points: 1 });
assert(state.us === 2 && state.them === 1, 'add them +1');

state = gameReducer(state, { type: 'UNDO' });
assert(state.us === 2 && state.them === 0, 'undo last move');

for (let i = 0; i < 3; i++) {
  state = gameReducer(state, { type: 'ADD_POINTS', team: 'us', points: 4 });
}
assert(state.us === 14 && state.winner === 'us', 'win at 12+ with +4');
assert(state.partidas.length === 1, 'completed partida archived');
assert(state.partidas[0].us === 14 && state.partidas[0].winner === 'us', 'partida final score');

const blocked = gameReducer(state, { type: 'ADD_POINTS', team: 'them', points: 1 });
assert(blocked === state, 'block scoring after win');

state = gameReducer(state, { type: 'UNDO' });
assert(state.winner === null && state.partidas.length === 0, 'undo after win removes partida');

for (let i = 0; i < 3; i++) {
  state = gameReducer(state, { type: 'ADD_POINTS', team: 'us', points: 4 });
}
assert(state.partidas.length === 1, 're-archive partida after win');

state = gameReducer(state, { type: 'RESET' });
assert(state.us === 0 && state.moves.length === 0, 'reset current game');
assert(state.partidas.length === 1, 'reset preserves partidas history');

state = gameReducer(state, { type: 'ADD_POINTS', team: 'them', points: 2 });
state = gameReducer(state, { type: 'RESET' });
assert(state.partidas.length === 1, 'mid-game reset preserves partidas');

console.log('✓ All truco game logic tests passed');
