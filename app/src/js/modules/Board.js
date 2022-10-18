import { ColorTile } from './Tiles/ColorTile.js';
import { FreeParkingTile } from './Tiles/FreeParkingTile.js';
import { GoTile } from './Tiles/GoTile.js';
import { JailTile } from './Tiles/JailTile.js';
import { GoToJailTile } from './Tiles/GoToJailTile.js';
import { RailroadTile } from './Tiles/RailroadTile.js';
const PIXI = window.PIXI;

export class Board {
  draw(container) {
    console.log('drawing board');
    try {
      const width = 1200;
      const height = 1200;

      const boardContainer = new PIXI.Container();

      const scale = Math.min(
        window.innerWidth / width,
        window.innerHeight / height
      );
      boardContainer.scale = new PIXI.Point(scale, scale);

      this.board = new PIXI.Graphics();
      this.board.beginFill(0xcde6d0);
      this.board.lineStyle(2, 0xff0000, 1);
      this.board.drawRect(0, 0, width, height);
      this.board.endFill();
      boardContainer.addChild(this.board);

      const title = new PIXI.Text('Megacorp', {
        fontFamily: 'Arial',
        fontSize: 48,
        fill: 0x000000,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: width
      });
      title.pivot.x = title.width / 2;
      title.x = width / 2;
      title.y = height / 2 - title.height / 2;
      boardContainer.addChild(title);

      this.goTile = new GoTile();
      this.goTile.draw(boardContainer, width - 150, height - 150);

      this.mediterraneanAvenue = new ColorTile(
        'Mediterranean Avenue',
        0x955436,
        60
      );
      this.mediterraneanAvenue.draw(
        boardContainer,
        width - 150 - 100,
        height - 150
      );

      this.communityChest1 = new ColorTile('Community Chest', 0x000000, 0);
      this.communityChest1.draw(
        boardContainer,
        width - 100 - 150 - 100,
        height - 150
      );

      this.balticAvenue = new ColorTile('Baltic Avenue', 0x955436, 60);
      this.balticAvenue.draw(
        boardContainer,
        width - 100 - 150 - 100 - 100,
        height - 150
      );

      this.incomeTax = new ColorTile('Income Tax', 0x000000, 0);
      this.incomeTax.draw(boardContainer, width - 150 - 100 * 4, height - 150);

      this.readingRailroad = new RailroadTile(
        'Reading Railroad',
        0x000000,
        200
      );
      this.readingRailroad.draw(
        boardContainer,
        width - 150 - 100 * 5,
        height - 150
      );

      this.orientalAvenue = new ColorTile('Oriental Avenue', 0xace2fc, 100);
      this.orientalAvenue.draw(
        boardContainer,
        width - 150 - 100 * 6,
        height - 150
      );

      this.chance1 = new ColorTile('Chance', 0x000000, 0);
      this.chance1.draw(boardContainer, width - 150 - 100 * 7, height - 150);

      this.vermontAvenue = new ColorTile('Vermont Avenue', 0xace2fc, 100);
      this.vermontAvenue.draw(
        boardContainer,
        width - 150 - 100 * 8,
        height - 150
      );

      this.connecticutAvenue = new ColorTile(
        'Connecticut Avenue',
        0xace2fc,
        120
      );
      this.connecticutAvenue.draw(
        boardContainer,
        width - 150 - 100 * 9,
        height - 150
      );

      this.jail = new JailTile('Jail', 0x000000, 0);
      this.jail.draw(boardContainer, 0, height - 150);

      this.stCharlesPlace = new ColorTile('St. Charles Place', 0xd93a96, 140);
      this.stCharlesPlace.draw(
        boardContainer,
        150,
        height - 150 - 100,
        Math.PI / 2
      );

      this.electricCompany = new ColorTile('Electric Company', 0x000000, 150);
      this.electricCompany.draw(
        boardContainer,
        150,
        height - 150 - 100 * 2,
        Math.PI / 2
      );

      this.statesAvenue = new ColorTile('States Avenue', 0xd93a96, 140);
      this.statesAvenue.draw(
        boardContainer,
        150,
        height - 150 - 100 * 3,
        Math.PI / 2
      );

      this.virginiaAvenue = new ColorTile('Virginia Avenue', 0xd93a96, 160);
      this.virginiaAvenue.draw(
        boardContainer,
        150,
        height - 150 - 100 * 4,
        Math.PI / 2
      );

      this.pennsylvaniaRailroad = new RailroadTile(
        'Pennsylvania Railroad',
        0x000000,
        200
      );
      this.pennsylvaniaRailroad.draw(
        boardContainer,
        150,
        height - 150 - 100 * 5,
        Math.PI / 2
      );

      this.stJamesPlace = new ColorTile('St. James Place', 0xf7941d, 180);
      this.stJamesPlace.draw(
        boardContainer,
        150,
        height - 150 - 100 * 6,
        Math.PI / 2
      );

      this.communityChest2 = new ColorTile('Community Chest', 0x000000, 0);
      this.communityChest2.draw(
        boardContainer,
        150,
        height - 150 - 100 * 7,
        Math.PI / 2
      );

      this.tennesseeAvenue = new ColorTile('Tennessee Avenue', 0xf7941d, 180);
      this.tennesseeAvenue.draw(
        boardContainer,
        150,
        height - 150 - 100 * 8,
        Math.PI / 2
      );

      this.newYorkAvenue = new ColorTile('New York Avenue', 0xf7941d, 200);
      this.newYorkAvenue.draw(
        boardContainer,
        150,
        height - 150 - 100 * 9,
        Math.PI / 2
      );

      this.freeParking = new FreeParkingTile('Free Parking', 0x000000, 0);
      this.freeParking.draw(boardContainer, 0, 0);

      this.kentuckyAvenue = new ColorTile('Kentucky Avenue', 0xed1b24, 220);
      this.kentuckyAvenue.draw(boardContainer, 150, 0, 0);

      this.chance2 = new ColorTile('Chance', 0x000000, 0);
      this.chance2.draw(boardContainer, 150 + 100, 0, 0);

      this.indianaAvenue = new ColorTile('Indiana Avenue', 0xed1b24, 220);
      this.indianaAvenue.draw(boardContainer, 150 + 100 * 2, 0, 0);

      this.illinoisAvenue = new ColorTile('Illinois Avenue', 0xed1b24, 240);
      this.illinoisAvenue.draw(boardContainer, 150 + 100 * 3, 0, 0);

      this.bAndORailroad = new RailroadTile('B & O Railroad', 0x000000, 200);
      this.bAndORailroad.draw(boardContainer, 150 + 100 * 4, 0, 0);

      this.atlanticAvenue = new ColorTile('Atlantic Avenue', 0xfef200, 260);
      this.atlanticAvenue.draw(boardContainer, 150 + 100 * 5, 0, 0);

      this.ventnorAvenue = new ColorTile('Ventnor Avenue', 0xfef200, 260);
      this.ventnorAvenue.draw(boardContainer, 150 + 100 * 6, 0, 0);

      this.waterWorks = new ColorTile('Water Works', 0x000000, 150);
      this.waterWorks.draw(boardContainer, 150 + 100 * 7, 0, 0);

      this.marvinGardens = new ColorTile('Marvin Gardens', 0xfef200, 280);
      this.marvinGardens.draw(boardContainer, 150 + 100 * 8, 0, 0);

      this.goToJail = new GoToJailTile('Go To Jail', 0x000000, 0);
      this.goToJail.draw(boardContainer, 150 + 100 * 9, 0, 0);

      this.pacificAvenue = new ColorTile('Pacific Avenue', 0x1fb25a, 300);
      this.pacificAvenue.draw(
        boardContainer,
        width - 150,
        150 + 100,
        -Math.PI / 2
      );

      this.northCarolinaAvenue = new ColorTile(
        'North Carolina Avenue',
        0x1fb25a,
        300
      );
      this.northCarolinaAvenue.draw(
        boardContainer,
        width - 150,
        150 + 100 * 2,
        -Math.PI / 2
      );

      this.communityChest3 = new ColorTile('Community Chest', 0x000000, 0);
      this.communityChest3.draw(
        boardContainer,
        width - 150,
        150 + 100 * 3,
        -Math.PI / 2
      );

      this.pennsylvaniaAvenue = new ColorTile(
        'Pennsylvania Avenue',
        0x1fb25a,
        320
      );
      this.pennsylvaniaAvenue.draw(
        boardContainer,
        width - 150,
        150 + 100 * 4,
        -Math.PI / 2
      );

      this.shortLine = new RailroadTile('Short Line', 0x000000, 200);
      this.shortLine.draw(
        boardContainer,
        width - 150,
        150 + 100 * 5,
        -Math.PI / 2
      );

      this.chance3 = new ColorTile('Chance', 0x000000, 0);
      this.chance3.draw(
        boardContainer,
        width - 150,
        150 + 100 * 6,
        -Math.PI / 2
      );

      this.parkPlace = new ColorTile('Park Place', 0x0072bb, 350);
      this.parkPlace.draw(
        boardContainer,
        width - 150,
        150 + 100 * 7,
        -Math.PI / 2
      );

      this.luxuryTax = new ColorTile('Luxury Tax', 0x000000, 0);
      this.luxuryTax.draw(
        boardContainer,
        width - 150,
        150 + 100 * 8,
        -Math.PI / 2
      );

      this.boardwalk = new ColorTile('Boardwalk', 0x0072bb, 400);
      this.boardwalk.draw(
        boardContainer,
        width - 150,
        150 + 100 * 9,
        -Math.PI / 2
      );

      container.addChild(boardContainer);

      this.tiles = [
        this.go,
        this.mediterraneanAvenue,
        this.communityChest1,
        this.balticAvenue,
        this.incomeTax,
        this.readingRailroad,
        this.orientalAvenue,
        this.chance1,
        this.vermontAvenue,
        this.connecticutAvenue,
        this.jail,
        this.stCharlesPlace,
        this.electricCompany,
        this.statesAvenue,
        this.virginiaAvenue,
        this.pennsylvaniaRailroad,
        this.stJamesPlace,
        this.communityChest2,
        this.tennesseeAvenue,
        this.newYorkAvenue,
        this.freeParking,
        this.kentuckyAvenue,
        this.chance2,
        this.indianaAvenue,
        this.illinoisAvenue,
        this.bAndORailroad,
        this.atlanticAvenue,
        this.ventnorAvenue,
        this.waterWorks,
        this.marvinGardens,
        this.goToJail,
        this.pacificAvenue,
        this.northCarolinaAvenue,
        this.communityChest3,
        this.pennsylvaniaAvenue,
        this.shortLine,
        this.chance3,
        this.parkPlace,
        this.luxuryTax,
        this.boardwalk
      ];
    } catch (error) {
      console.log(error);
    }
  }
}
