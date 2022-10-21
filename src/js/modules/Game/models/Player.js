
import { randomUUID } from 'crypto';

export class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id || randomUUID();
    this.color = 0xff0000;
    this.money = 1000;
    this.hasRolledDice = false;
    this.diceDoubles = 0;
    this.prevPosition = 0;
    this.position = 0;
    this.diceDoublesInRow = 0;
    this.isInJail = false;
    this.requiresPropertyAction = false;
    this.state = 'turnStart';
  }
}
