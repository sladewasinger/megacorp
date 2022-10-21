export class Railroad {
  constructor(name, cost, rent) {
    this.name = name;
    this.type = 'property';

    this.cost = cost;
    this.rent = rent;
    this.mortgage = cost / 2;
    this.buybackFee = this.mortgage * 1.1;
  }

  onEnter(stateMachine, gameState) {
    console.log(this.name);
    this.gameState = gameState;
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
    this.gameState.currentPlayer.money -= this.rent;

    if (this.gameState.doubleDiceRoll) {
      return 'TurnStart';
    }

    return 'TurnEnd';
  }

  auctionProperty() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('auctionProperty');

    if (this.gameState.doubleDiceRoll) {
      return 'TurnStart';
    }

    return 'TurnEnd';
  }
}
