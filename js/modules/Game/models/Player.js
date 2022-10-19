
import { randomUUID } from 'crypto';

export class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id || randomUUID();
    this.money = 1000;
    this.hasRolledDice = false;
    this.position = 0;
    this.diceRollsInARow = 0;
    this.isInJail = false;
    this.requiresPropertyAction = false;
  }
}
