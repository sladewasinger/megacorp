export class BottomAnimations {
  constructor(container, width, height) {
    this.container = container;
    this.width = width;
    this.height = height;
    this.animationsContainer = new PIXI.Container();
    this.animationsContainer.x = 0;
    this.animationsContainer.y = 0;
    this.animationsContainer.width = width;
    this.animationsContainer.height = height;
    this.container.addChild(this.animationsContainer);
  }

  update(gameState, renderState, tiles) {
    if (
      gameState.state.name == 'Auction'
    ) {
      this.drawAuctionStuff(gameState, tiles);
    }

    if (
      gameState.prevState.name == 'Auction' &&
      gameState.state.name != 'Auction'
    ) {
      this.clearAuctionStuff();
    }
  }

  clearAuctionStuff() {
    this.auctionLineOutline.clear();
    this.auctionLine.clear();
    this.auctionLineArrowHead.clear();
    this.auctionLineArrowStart.clear();
    this.auctionText.visible = false;
  }

  drawAuctionStuff(gameState, tiles) {
    const tile = tiles[gameState.auction.property.tileId];

    const tileRotation = tile.tileContainer.rotation;
    const tileHeight = tile.tileContainer.height;

    const padding = 10;
    const initialEndPos = {
      x: tile.tileContainer.x,
      y: tile.tileContainer.y,
    };
    const startPos = {
      x: this.width / 2,
      y: this.height / 2,
    };
    if (tileRotation == 0) {
      if (initialEndPos.y < this.height / 2) {
        initialEndPos.y += (tileHeight / 2 + padding);
        startPos.y -= (this.auctionText.height / 2 + padding);
      } else {
        initialEndPos.y -= (tileHeight / 2 + padding);
        startPos.y += (this.auctionText.height / 2 + padding);
      }
    } else if (tileRotation == Math.PI / 2) {
      initialEndPos.x += tileHeight / 2 + padding;
      startPos.x -= (this.auctionText.width / 2 + padding);
    } else if (tileRotation == - Math.PI / 2) {
      initialEndPos.x -= (tileHeight / 2 + padding);
      startPos.x += (this.auctionText.width / 2 + padding);
    }

    const line = {
      start: {
        x: startPos.x,
        y: startPos.y,
      },
      end: {
        x: initialEndPos.x,
        y: initialEndPos.y,
      },
    };

    this.auctionLineOutline.clear();
    this.auctionLineOutline.lineStyle(10, 0x000000, 1);
    this.auctionLineOutline.moveTo(line.start.x, line.start.y);
    this.auctionLineOutline.lineTo(line.end.x, line.end.y);

    this.auctionLine.clear();
    this.auctionLine.lineStyle(5, tile.color, 1);
    this.auctionLine.moveTo(line.start.x, line.start.y);
    this.auctionLine.lineTo(line.end.x, line.end.y);

    this.auctionLineArrowStart.clear();
    this.auctionLineArrowStart.lineStyle(2.5, 0x000000, 1);
    this.auctionLineArrowStart.beginFill(tile.color, 1);
    this.auctionLineArrowStart.drawCircle(line.start.x, line.start.y, 10);
    this.auctionLineArrowStart.endFill();

    this.auctionLineArrowHead.clear();
    this.auctionLineArrowHead.lineStyle(2.5, 0x000000, 1);
    this.auctionLineArrowHead.beginFill(tile.color, 1);
    this.auctionLineArrowHead.drawCircle(line.end.x, line.end.y, 10);
    this.auctionLineArrowHead.endFill();

    this.auctionText.visible = true;
  }

  draw() {
    const container = new PIXI.Container();
    this.auctionLineOutline = new PIXI.Graphics();

    this.auctionLine = new PIXI.Graphics();

    this.auctionLineArrowHead = new PIXI.Graphics();

    this.auctionLineArrowStart = new PIXI.Graphics();

    this.auctionText = new PIXI.Text('Auction', {
      fontFamily: 'Arial',
      fontSize: 100,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
      dropShadow: true,
      dropShadowColor: '#ffffff',
      dropShadowBlur: 20,
      dropShadowDistance: 0,
    });
    this.auctionText.pivot.x = this.auctionText.width / 2;
    this.auctionText.pivot.y = this.auctionText.height / 2;
    this.auctionText.x = this.width / 2;
    this.auctionText.y = this.height / 2;
    this.auctionText.visible = false;

    container.addChild(this.auctionLineOutline,
      this.auctionLine,
      this.auctionLineArrowHead,
      this.auctionLineArrowStart,
      this.auctionText);
    this.animationsContainer.addChild(container);
  }
}
