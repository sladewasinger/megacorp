const PIXI = window.PIXI;

export class JailTile {
  constructor() {
    this.width = 150;
    this.height = 150;
  }

  update(index, gameState, renderState) {
    if (renderState.propertyActionInProgress) {
      this.tileContainer.alpha = 0.25;
    } else {
      this.tileContainer.alpha = 1;
    }
  }

  getJailPos() {
    return {
      x: this.tileContainer.x + 75,
      y: this.tileContainer.y,
    };
  }

  getJustVisitingPos() {
    return {
      x: this.tileContainer.x + 20,
      y: this.tileContainer.y + 40,
    };
  }

  draw(container, x, y, rotation = 0) {
    const tileContainer = new PIXI.Container();
    this.tileContainer = tileContainer;
    this.tileContainer.width = this.width;
    this.tileContainer.height = this.height;
    this.tileContainer.pivot = new PIXI.Point(this.width / 2, this.height / 2);

    this.tile = new PIXI.Graphics();
    this.tile.beginFill(0xffffff);
    this.tile.lineStyle(2, 0x000000, 1);
    this.tile.drawRect(0, 0, this.width, this.height);
    this.tile.endFill();
    tileContainer.addChild(this.tile);

    this.jailBox = new PIXI.Graphics();
    this.jailBox.beginFill(0xFFA500);
    this.jailBox.lineStyle(2, 0x000000, 1);
    this.jailBox.drawRect(0, 0, 90, 90);
    this.jailBox.endFill();
    this.jailBox.x = this.width - this.jailBox.width;
    this.jailBox.y = 0;
    tileContainer.addChild(this.jailBox);

    const title = new PIXI.Text('Jail', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width - title.width;
    title.y = 0 + title.height / 2;
    tileContainer.addChild(title);

    this.justVisitingText1 = new PIXI.Text('Just', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.justVisitingText1.rotation = Math.PI / 2;
    this.justVisitingText1.pivot.x = this.justVisitingText1.width / 2;
    this.justVisitingText1.x = 40;
    this.justVisitingText1.y = 70;
    tileContainer.addChild(this.justVisitingText1);

    this.justVisitingText2 = new PIXI.Text('Visiting', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.justVisitingText2.pivot.x = this.justVisitingText2.width / 2;
    this.justVisitingText2.x = this.width / 2;
    this.justVisitingText2.y = this.height - 40;
    tileContainer.addChild(this.justVisitingText2);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
