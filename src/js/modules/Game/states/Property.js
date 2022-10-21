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
  }

  get rent() {
    if (this.owner === null) {
      return 0;
    }
    let index = this.houses;
    if (this.hotel) {
      index++;
    }
    return this.rents[index];
  }

  onEnter(gameState) {
    console.log('Property');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Property exit');
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
