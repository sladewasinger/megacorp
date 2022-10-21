import { GameState } from "./GameState";

export interface IState {
  name: string;

  onEnter(gameState: GameState): void;
  onExit(): void;
}
