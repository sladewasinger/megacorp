const PIXI = window.PIXI;

export class ColorTile {
  constructor(title, color, price) {
    this.title = title;
    this.title = this.title
      .split(' ')
      .map((word) => {
        let newWord = '';
        const maxLength = 9;
        while (word.length > 11) {
          newWord += word.substr(0, maxLength) + '-\n';
          word = word.substr(maxLength);
        }
        return newWord + word;
      })
      .join(' ');

    this.color = color;
    this.price = price;
  }

  update(gameState) {

  }

  draw(container, x, y, rotation = 0) {
    const tileContainer = new PIXI.Container();
    this.tileContainer = tileContainer;

    const width = 100;
    const height = 150;
    this.tile = new PIXI.Graphics();
    this.tile.beginFill(0xffffff);
    this.tile.lineStyle(2, 0x000000, 1);
    this.tile.drawRect(0, 0, width, height);
    this.tile.endFill();
    tileContainer.addChild(this.tile);

    const colorBar = new PIXI.Graphics();
    colorBar.beginFill(this.color);
    colorBar.lineStyle(2, 0x000000, 1);
    colorBar.drawRect(0, 0, width, 30);
    colorBar.endFill();
    tileContainer.addChild(colorBar);

    const title = new PIXI.Text(this.title, {
      fontFamily: 'Arial',
      fontSize: 19,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: width,
    });
    title.pivot.x = title.width / 2;
    title.x = width / 2;
    title.y = colorBar.height;
    tileContainer.addChild(title);

    const price = new PIXI.Text(`$${this.price}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
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
