export class Railroad {
  constructor(name, cost) {
    this.name = name;
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

    const ownedRailroads = this.stateMachine
      .getStates()
      .filter((state) => state instanceof Railroad);
    const rentTemp = 25 * (2 ** (ownedRailroads.length - 1));
    return rentTemp;
  }

  onEnter(stateMachine, gameState) {
    console.log(this.name);
    this.gameState = gameState;
    this.stateMachine = stateMachine;

    if (this.owner !== null) {
      if (this.owner !== gameState.currentPlayer) {
        this.gameState.currentPlayer.money -= this.rent;
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
    this.gameState.currentPlayer.money -= this.rent;
    this.gameState.currentPlayer.properties.push(this.name);

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
