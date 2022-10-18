export class ColorTile {
  constructor(name, color, cost) {
    this.name = name;
    this.color = color;
    this.cost = cost;
    this.type = 'color';
    this.buyable = true;
  }
}
