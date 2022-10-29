export class CommunityChest {
  constructor(container) {
    this.container = container;
    this.width = 300;
    this.height = 150;
    this.communityChestContainer = new PIXI.Container();
    this.container.addChild(this.communityChestContainer);
    this.lastCommunityChestCard = null;
  }

  update(gameState, renderState) {
    if (gameState.state.name == 'TurnStart' && gameState.prevState?.name == 'TurnEnd') {
      this.setCardText('', '');
      this.setInvisible();
      return;
    }
    if (gameState.state.name != 'Community Chest') {
      return;
    }

    if (!gameState.communityChestCard) {
      return;
    }
    // if (gameState.communityChestCard.name == this.lastCommunityChestCard?.name) {
    //   return;
    // }

    this.lastCommunityChestCard = gameState.communityChestCard;

    this.setCardText(gameState.communityChestCard.name, gameState.communityChestCard.msg);
  }

  setCardText(name, msg) {
    this.cardTitle.text = name;
    this.cardMsg.text = msg;
  }

  setInvisible() {
    this.communityChestContainer.visible = false;
  }

  setVisible() {
    this.communityChestContainer.visible = true;
  }

  draw(x, y) {
    this.communityChestContainer.x = x;
    this.communityChestContainer.y = y;

    this.communityChestBackground = new PIXI.Graphics();
    this.communityChestBackground.beginFill(0xffffff);
    this.communityChestBackground.drawRect(0, 0, this.width, this.height);
    this.communityChestBackground.endFill();
    this.communityChestContainer.addChild(this.communityChestBackground);

    this.communityChestText = new PIXI.Text('Community Chest', {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
    });
    this.communityChestText.x = 0;
    this.communityChestText.y = 0;
    this.communityChestContainer.addChild(this.communityChestText);

    this.cardTitle = new PIXI.Text('TITLE', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'right',
    });
    this.cardTitle.x = 0;
    this.cardTitle.y = this.communityChestText.height + 10;
    this.communityChestContainer.addChild(this.cardTitle);

    this.cardMsg = new PIXI.Text('MESSAGE', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'right',
    });
    this.cardMsg.x = 0;
    this.cardMsg.y = this.cardTitle.y + this.cardTitle.height + 10;
    this.communityChestContainer.addChild(this.cardMsg);

    this.setInvisible();
  }
}
