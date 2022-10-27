export class Utility {
  constructor(name, cost) {
    this.name = name;
    this.type = 'property';

    this.cost = cost;
    this.mortgage = cost / 2;
    this.buybackFee = this.mortgage * 1.1;
    this.owner = null;
  }

  get rent() {
    if (!this.gameState || !this.owner) {
      return 0;
    }

    const ownedUtilities = this.owner.properties
      .filter((title) =>
        title == 'Electric Company' ||
        title == 'Water Works',
      ).length;
    let rentTemp = 0;
    if (ownedUtilities == 1) {
      rentTemp = this.gameState.lastRoll * 10;
    } else if (ownedUtilities == 2) {
      rentTemp = this.gameState.lastRoll * 20;
    }
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
    console.log('Utility exit');
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
