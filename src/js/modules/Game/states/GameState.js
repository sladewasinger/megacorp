import { CommunityChestDeck } from '../models/CommunityChestDeck.js';
import { ChanceDeck } from '../models/ChanceDeck.js';

export class GameState {
  constructor() {
    this.id = 0;

    this.dice1 = 0;
    this.dice2 = 0;
    this.doubleDiceRollCount = 0;
    this.players = [];

    this.communityChestDeck = new CommunityChestDeck();
    this.chanceDeck = new ChanceDeck();
    this.communityChestCard = null;
    this.chanceCard = null;

    this.auction = null;

    this.tiles = [
      'Go',
      'Mediterranean Avenue',
      'Community Chest',
      'Baltic Avenue',
      'Income Tax',
      'Reading Railroad',
      'Oriental Avenue',
      'Chance',
      'Vermont Avenue',
      'Connecticut Avenue',
      'Jail',
      'St. Charles Place',
      'Electric Company',
      'States Avenue',
      'Virginia Avenue',
      'Pennsylvania Railroad',
      'St. James Place',
      'Community Chest',
      'Tennessee Avenue',
      'New York Avenue',
      'Free Parking',
      'Kentucky Avenue',
      'Chance',
      'Indiana Avenue',
      'Illinois Avenue',
      'B. & O. Railroad',
      'Atlantic Avenue',
      'Ventnor Avenue',
      'Water Works',
      'Marvin Gardens',
      'Go To Jail',
      'Pacific Avenue',
      'North Carolina Avenue',
      'Community Chest',
      'Pennsylvania Avenue',
      'Short Line',
      'Chance',
      'Park Place',
      'Luxury Tax',
      'Boardwalk',
    ];
  }

  currentProperty(stateMachine) {
    const tile = this.tiles[this.currentPlayer.position];
    const tileState = stateMachine.states[this.tiles[this.currentPlayer.position]];
    if (!tileState) {
      console.error('No state for tile:', tile);
    };

    return tileState;
  }

  get currentPlayer() {
    return this.players[0];
  }

  get doubleDiceRoll() {
    return this.dice1 === this.dice2;
  }
}
