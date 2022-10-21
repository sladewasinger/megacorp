import { Player } from "./Player";
import { GameState } from "./GameState";
import { IBuyable } from "./IBuyable";
import { IState } from "./IState";

export class Property implements IState, IBuyable {
  type: string = 'property';
  state: any;
  owner: Player | null = null;
  houses: number = 0;
  hotel: number = 0;
  gameState: GameState | null = null;

  constructor(
    public name: string,
    public color: number,
    public cost: number,
    public rents: number[],
    public mortgageValue: number,
    public houseCost: number,
    public hotelCost: number
  ) { }

  transition(transitionName: string, ...args: any[]): string {
    throw new Error("Method not implemented.");
  }

  onEnter(gameState: GameState) {
    console.log('Property');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Property exit');
  }

  get rent(): number {
    if (this.owner === null) {
      return 0;
    }
    let index: number = this.houses;
    if (this.hotel) {
      index++;
    }
    return this.rents[0];
  }

  buyProperty() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('buyProperty');

    this.owner = this.gameState.currentPlayer;
    this.gameState.currentPlayer.money -= this.rent;

    if (this.gameState!.doubleDiceRoll) {
      return 'TurnStart';
    }

    return 'TurnEnd';
  }

  auctionProperty() {
    if (!this.gameState) {
      throw new Error('Game state not set');
    }

    console.log('auctionProperty');

    if (this.gameState!.doubleDiceRoll) {
      return 'TurnStart';
    }

    return 'TurnEnd';
  }
}
