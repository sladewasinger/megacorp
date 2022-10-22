export class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.money = 1500;
    this.properties = [];
    this.positionsVisited = [];
    this.position = 0;
    this.prevPosition = 0;
    this.inJail = false;
    this.jailTurns = 3;
    this.directMovement = false;
    this.getOutOfJailFreeCards = 0;
  }
}
