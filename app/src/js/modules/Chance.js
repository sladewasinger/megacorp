export class Chance {
  constructor(container) {
    this.container = container;
    this.width = 300;
    this.height = 150;
    this.chanceContainer = new PIXI.Container();
    this.container.addChild(this.chanceContainer);
    this.lastChanceCard = null;
  }

  update(gameState, renderState) {
    if (gameState.state.name == 'TurnStart' && gameState.prevState?.name == 'TurnEnd') {
      this.setCardText('', '');
      this.setInvisible();
      return;
    }
    if (gameState.state.name != 'Chance') {
      return;
    }

    if (!gameState.chanceCard) {
      return;
    }
    // if (gameState.communityChestCard.name == this.lastCommunityChestCard?.name) {
    //   return;
    // }

    this.lastChanceCard = gameState.communityChestCard;

    this.setCardText(gameState.chanceCard.name, gameState.chanceCard.msg);
  }

  setCardText(name, msg) {
    this.cardTitle.text = name;
    this.cardMsg.text = msg;
  }

  setInvisible() {
    this.chanceContainer.visible = false;
  }

  setVisible() {
    this.chanceContainer.visible = true;
  }

  draw(x, y) {
    this.chanceContainer.x = x;
    this.chanceContainer.y = y;

    this.chanceBackground = new PIXI.Graphics();
    this.chanceBackground.beginFill(0xffffff);
    this.chanceBackground.drawRect(0, 0, this.width, this.height);
    this.chanceBackground.endFill();
    this.chanceContainer.addChild(this.chanceBackground);

    this.chanceText = new PIXI.Text('Community Chest', {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
    });
    this.chanceText.x = 0;
    this.chanceText.y = 0;
    this.chanceContainer.addChild(this.chanceText);

    this.cardTitle = new PIXI.Text('TITLE', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'right',
    });
    this.cardTitle.x = 0;
    this.cardTitle.y = this.chanceText.height + 10;
    this.chanceContainer.addChild(this.cardTitle);

    this.cardMsg = new PIXI.Text('MESSAGE', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'right',
    });
    this.cardMsg.x = 0;
    this.cardMsg.y = this.cardTitle.y + this.cardTitle.height + 10;
    this.chanceContainer.addChild(this.cardMsg);

    this.setInvisible();
  }
}
