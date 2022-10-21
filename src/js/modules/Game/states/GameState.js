import { CommunityChestDeck } from '../models/CommunityChestDeck.js';
import { ChanceDeck } from '../models/ChanceDeck.js';

export class GameState {
  constructor() {
    this.dice1 = 0;
    this.dice2 = 0;
    this.doubleDiceRollCount = 0;
    this.players = [];

    this.communityChestDeck = new CommunityChestDeck();
    this.chanceDeck = new ChanceDeck();
    this.communityChestMessage = '';
    this.chanceMessage = '';

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

  get currentPlayer() {
    return this.players[0];
  }

  get doubleDiceRoll() {
    return this.dice1 === this.dice2;
  }
}
