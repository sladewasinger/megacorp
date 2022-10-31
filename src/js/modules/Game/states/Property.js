import { randomUUID } from 'crypto';

export class Property {
  constructor(name, color, cost, rents, houseCost, hotelCost) {
    this.id = randomUUID();
    this.name = name;
    this.type = 'property';
    this.subtype = 'color';

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
    this.mortgaged = false;
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
    console.log(`${this.name}: Enter`);
    this.gameState = gameState;
    this.stateMachine = stateMachine;

    if (this.owner !== null) {
      if (this.owner !== gameState.currentPlayer && !this.mortgaged) {
        this.gameState.currentPlayer.money -= this.rent;
        this.owner.money += this.rent;
      }
      stateMachine.setState('TurnEnd', gameState);
      return;
    }
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
