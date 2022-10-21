export class Property {
  constructor(name, color, cost, rents, houseCost, hotelCost) {
    this.name = name;
    this.type = 'property';

    this.title = name;
    this.color = color;
    this.cost = cost;
    this.rents = rents;
    this.houseCost = houseCost;
    this.hotelCost = hotelCost;
    this.mortgage = cost / 2;
    this.buybackFee = this.mortgage * 1.1;
    this.owner = null;
    this.houses = 0;
    this.hotel = false;
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

  onEnter(stateMachine, gameState) {
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
    this.gameState.currentPlayer.properties.push({
      name: this.name,
      type: this.type,
      color: this.color,
      cost: this.cost,
      rents: this.rents,
      houseCost: this.houseCost,
      hotelCost: this.hotelCost,
      mortgage: this.mortgage,
      buybackFee: this.buybackFee,
      houses: this.houses,
      hotel: this.hotel,
    });

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
