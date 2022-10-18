import { Color } from "./Color.js";
import { ColorTile } from "./Tiles/ColorTile.js";

export class Board {
  constructor() {}

  draw(container) {
    console.log("drawing board");
    try {
      const width = 1000;
      const height = 1000;
      this.board = new PIXI.Graphics();
      this.board.beginFill(0xcde6d0);
      this.board.lineStyle(2, 0xff0000, 1);
      this.board.drawRect(0, 0, 1000, 1000);
      this.board.endFill();

      container.addChild(this.board);

      this.mediterraneanAvenue = new ColorTile(
        "Mediterranean Avenue",
        0x955436,
        60
      );
      this.mediterraneanAvenue.draw(container, width - 100 - 150, height - 150);
    } catch (error) {
      console.log(error);
    }
  }
}
