export class Property {
  constructor(name, color, cost, rent, mortgageValue, houseCost, hotelCost) {
    this.name = name;
    this.type = 'property';

    this.state = {
      title: name,
      color,
      cost,
      rent,
      mortgageValue,
      houseCost,
      hotelCost,
      owner: null,
      houses: 0,
      hotel: false,
    };

    this.transitions = {
      buyProperty: this.buyProperty,
      auctionProperty: this.auctionProperty,
    };
  }

  get name() {
    return 'Property';
  }

  onEnter(gameState) {
    console.log('Property');
  }

  onExit() {
    console.log('Property exit');
  }

  buyProperty() {
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
