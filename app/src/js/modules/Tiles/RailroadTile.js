export class RailroadTile {
  constructor(title, color, price) {
    this.title = title;
    this.title = this.title
      .split(" ")
      .map((word) => {
        let newWord = "";
        const maxLength = 9;
        while (word.length > 11) {
          newWord += word.substr(0, maxLength) + "-\n";
          word = word.substr(maxLength);
        }
        return newWord + word;
      })
      .join(" ");

    this.color = color;
    this.price = price;
  }

  draw(container, x, y, rotation = 0) {
    const tileContainer = new PIXI.Container();

    const width = 100;
    const height = 150;

    this.tile = new PIXI.Graphics();
    this.tile.beginFill(0xffffff);
    this.tile.lineStyle(2, 0x000000, 1);
    this.tile.drawRect(0, 0, width, height);
    this.tile.endFill();
    tileContainer.addChild(this.tile);

    const title = new PIXI.Text(this.title, {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0x000000,
      align: "center",
      wordWrap: true,
      wordWrapWidth: width,
    });
    title.pivot.x = title.width / 2;
    title.x = width / 2;
    tileContainer.addChild(title);

    const image = new PIXI.Sprite.from("src/assets/railroad.png");
    image.width = 69;
    image.height = 50;
    image.x = width / 2 - image.width / 2;
    image.y = height / 2 - image.height / 2;
    tileContainer.addChild(image);

    const price = new PIXI.Text(`$${this.price}`, {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x000000,
      align: "center",
      wordWrap: true,
      wordWrapWidth: width,
    });
    price.pivot.x = price.width / 2;
    price.x = width / 2;
    price.y = height - 30;
    tileContainer.addChild(price);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
