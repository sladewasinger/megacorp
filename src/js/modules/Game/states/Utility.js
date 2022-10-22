export class Utility {
  constructor(name, cost) {
    this.name = name;
    this.type = 'property';

    this.cost = cost;
    this.rent = 100;
    this.mortgage = cost / 2;
    this.buybackFee = this.mortgage * 1.1;
    this.owner = null;
  }

  onEnter(stateMachine, gameState) {
    console.log(this.name);
    this.gameState = gameState;

    if (this.owner !== null) {
      if (this.owner !== gameState.currentPlayer) {
        this.gameState.currentPlayer.money -= this.rent;
      }
      stateMachine.setState('TurnEnd', gameState);
    }
  }

  onExit() {
    console.log('Utility exit');
  }
}
