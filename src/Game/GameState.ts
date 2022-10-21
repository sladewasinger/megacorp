import { Player } from "./Player";

export class GameState {
  dice1: number = 0;
  dice2: number = 0;
  doubleDiceRollCount: number = 0;
  players: Player[] = [];
  tiles: string[] = [
    'Go',
    'Mediterranean Avenue',
    // 'Community Chest',
    'Baltic Avenue',
    // 'Income Tax',
    // 'Reading Railroad',
    'Oriental Avenue',
    // 'Chance',
  ];

  get currentPlayer() {
    return this.players[0];
  }

  get doubleDiceRoll() {
    return this.dice1 === this.dice2;
  }
}
