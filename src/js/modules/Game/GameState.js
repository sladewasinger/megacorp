export class GameState {
  constructor(players) {
    this.dice1 = 0;
    this.dice2 = 0;
    this.doubleDiceRollCount = 0;
    this.players = players;
    this.tiles = [
      'Go',
      'Mediterranean Avenue',
      // 'Community Chest',
      'Baltic Avenue',
      // 'Income Tax',
      // 'Reading Railroad',
      'Oriental Avenue',
      // 'Chance',
    ];
  }

  get currentPlayer() {
    return this.players[0];
  }

  get doubleDiceRoll() {
    return this.dice1 === this.dice2;
  }
}