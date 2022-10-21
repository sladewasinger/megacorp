import { IState } from '../states/State.js';

export class ColorTile extends IState {
  constructor(name, color, cost) {
    super();

    this.name = name;
    this.type = 'property';
    this.state = {
      color,
      cost,
      owner: null,
      houses: 0,
      hotel: false,
    };

    this.transitions = {
      buy: this.buyProperty,
    };
  }

  enter(gameState) {
    super.enter(gameState);

    if (this.state.owner) {
      this.gameState.payRent(this.state.owner);
    }
  }

  exit() {
    super.exit();
  }

  buyProperty(gameState) {
    if (this.state.owner) {
      return 'payRent';
    }
  }
}
