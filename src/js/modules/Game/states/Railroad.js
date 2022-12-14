import { randomUUID } from 'crypto';

export class Railroad {
  constructor(name, cost) {
    this.id = randomUUID();
    this.name = name;
    this.title = name;
    this.type = 'property';
    this.subtype = 'railroad';

    this.cost = cost;
    this.mortgage = cost / 2;
    this.buybackFee = this.mortgage * 1.1;
    this.owner = null;
  }

  get rent() {
    if (!this.gameState || !this.owner) {
      return 0;
    }

    const ownedRailroads = this.owner.properties
      .filter((title) =>
        title == 'Reading Railroad' ||
        title == 'Pennsylvania Railroad' ||
        title == 'B. & O. Railroad' ||
        title == 'Short Line',
      ).length;
    const rentTemp = 25 * (2 ** (ownedRailroads - 1));
    return rentTemp;
  }

  onEnter(stateMachine, gameState) {
    console.log(this.name);
    this.gameState = gameState;
    this.stateMachine = stateMachine;

    if (this.owner !== null) {
      if (this.owner !== gameState.currentPlayer && !this.mortgaged) {
        this.gameState.currentPlayer.money -= this.rent;
        this.owner.money += this.rent;
      }
      stateMachine.setState('TurnEnd', gameState);
    }
  }

  onExit() {
    console.log('Railroad exit');
  }

  buyProperty() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('buyProperty');

    this.owner = this.gameState.currentPlayer;
    this.gameState.currentPlayer.money -= this.cost;
    this.gameState.currentPlayer.properties.push(this.name);

    this.stateMachine.boughtPropertyCallbackFn(this.gameState);

    return 'TurnEnd';
  }

  auctionProperty() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('auctionProperty');

    return 'Auction';
  }
}
