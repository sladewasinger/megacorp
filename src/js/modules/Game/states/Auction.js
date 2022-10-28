export class Auction {
  constructor() {
    this.name = 'Auction';
  }

  onEnter(stateMachine, gameState) {
    console.log(`${this.name} -- enter`);
    this.gameState = gameState;
    this.auctionCallbackFn = stateMachine.auctionCallbackFn;

    if (!this.gameState.auction) {
      this.gameState.auction = {
        property: {
          name: this.gameState.currentProperty(stateMachine).name,
          tileId: this.gameState.currentPlayer.position,
        },
        bids: [],
        highestBid: () => {
          return this.gameState.auction.bids
            .sort((a, b) => b.order - a.order)
            .reduce((prev, current) => {
              return (prev.bidAmount > current.bidAmount) ? prev : current;
            });
        },
      };
    }
  }

  onExit() {
    console.log(`${this.name} -- exit`);
  }

  bid(playerId, bidAmount) {
    const player = this.gameState.players.find((p) => p.id === playerId);
    if (player.money < bidAmount || bidAmount < 0) {
      throw new Error('Not enough money');
    }

    console.log(`Bid: ${playerId} - ${bidAmount}`);
    this.gameState.auction.bids.push({
      playerId,
      bidAmount,
      order: this.gameState.auction.bids.length,
    });
    player.hasBid = true;
    if (this.gameState.auction.bids.length >= this.gameState.players.filter((p) => p.money > 0).length) {
      return 'EndAuction';
    }
    return 'Auction';
  }
}
