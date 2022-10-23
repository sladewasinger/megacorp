
export class EndAuction {
  constructor() {
    this.name = 'EndAuction';
  }

  onEnter(stateMachine, gameState) {
    console.log(`${this.name} -- enter`);
    this.gameState = gameState;
    this.auctionCallbackFn = stateMachine.auctionCallbackFn;

    const highestBid = this.gameState.auction.highestBid();
    const player = this.gameState.players.find((p) => p.id === highestBid.playerId);
    player.money -= highestBid.bidAmount;

    const currentProperty = this.gameState.currentProperty(stateMachine);
    currentProperty.owner = player;
    currentProperty.mortgaged = false;
    currentProperty.houses = 0;
    currentProperty.hotel = false;

    player.properties.push(currentProperty.name);

    stateMachine.setState('TurnEnd', gameState);
  }

  onExit() {
    console.log(`${this.name} -- exit`);
  }
}
