
export type GameType = 'ORB' | 'RUNNER';

export interface ReactionResult {
  id: string;
  gameType: GameType;
  timestamp: number;
  scoreMs: number;
}

export type AppView = 'HOME' | 'GAME_LIST' | 'GAME_ORB' | 'GAME_RUNNER' | 'RESULTS';

export interface GameConfig {
  rounds: number;
}
