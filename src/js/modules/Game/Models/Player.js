export class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.money = 1500;
    this.position = 0;
    this.properties = [];
    this.inJail = false;
    this.jailTurns = 3;
    this.getOutOfJailFreeCards = 0;
  }
}
