export class Railroad {
  constructor(name, cost, rent, mortgageValue) {
    this.name = name;
    this.type = 'railroad';

    this.state = {
      title: name,
      cost,
      rent,
      mortgageValue,
      owner: null,
    };

    this.transitions = {
      buyProperty: this.buyProperty,
      auctionProperty: this.auctionProperty,
    };
  }

  onEnter(gameState) {
    console.log('Railroad');
  }

  onExit() {
    console.log('Railroad exit');
  }

  buyProperty(gameState) {
    console.log('buyProperty');

    if (gameState.doubleDiceRoll) {
      return 'TurnStart';
    }

    return 'TurnEnd';
  }

  auctionProperty() {
    console.log('auctionProperty');
  }
}
