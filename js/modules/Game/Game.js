import { GoTile } from './Tiles/GoTile.js';
import { ColorTile } from './Tiles/ColorTile.js';
import { CommunityChest } from './Tiles/CommunityChest.js';
import { IncomeTaxTile } from './Tiles/IncomeTaxTile.js';
import { ChanceTile } from './Tiles/ChanceTile.js';
import { JailTile } from './Tiles/JailTile.js';
import { FreeParkingTile } from './Tiles/FreeParkingTile.js';
import { GoToJailTile } from './Tiles/GoToJailTile.js';
import { UtilityTile } from './Tiles/UtilityTile.js';
import { RailroadTile } from './Tiles/RailroadTile.js';
import { LuxuryTaxTile } from './Tiles/LuxuryTaxTile.js';

export class Player {
  constructor(name) {
    this.name = name;
    this.money = 1000;
    this.hasRolledDice = false;
    this.id =
      Math
        .random()
        .toString(36)
        .substring(2, 15) +
      Math
        .random()
        .toString(36)
        .substring(2, 15);
  }
}

export class Board {
  constructor() {
    this.goTile = new GoTile();
    this.mediteraneanAvenue = new ColorTile('Mediterranean Avenue', 0x955436, 60);
    this.communityChest1 = new CommunityChest();
    this.balticAvenue = new ColorTile('Baltic Avenue', 0x955436, 60);
    this.incomeTax = new IncomeTaxTile();
    this.readingRailroad = new RailroadTile('Reading Railroad', 200);
    this.orientalAvenue = new ColorTile('Oriental Avenue', 0xace2fc, 100);
    this.chance1 = new ChanceTile();
    this.vermontAvenue = new ColorTile('Vermont Avenue', 0xace2fc, 100);
    this.connecticutAvenue = new ColorTile('Connecticut Avenue', 0xace2fc, 120);
    this.jail = new JailTile();
    this.stCharlesPlace = new ColorTile('St. Charles Place', 0x8b8b8b, 140);
    this.electricCompany = new UtilityTile('Electric Company', 150);
    this.statesAvenue = new ColorTile('States Avenue', 0x8b8b8b, 140);
    this.virginiaAvenue = new ColorTile('Virginia Avenue', 0x8b8b8b, 160);
    this.pennsylvaniaRailroad = new RailroadTile('Pennsylvania Railroad', 200);
    this.stJamesPlace = new ColorTile('St. James Place', 0xd93a96, 180);
    this.communityChest2 = new CommunityChest();
    this.tennesseeAvenue = new ColorTile('Tennessee Avenue', 0xd93a96, 180);
    this.newYorkAvenue = new ColorTile('New York Avenue', 0xd93a96, 200);
    this.freeParking = new FreeParkingTile();
    this.kentuckyAvenue = new ColorTile('Kentucky Avenue', 0xed1b24, 220);
    this.chance2 = new ChanceTile();
    this.indianaAvenue = new ColorTile('Indiana Avenue', 0xed1b24, 220);
    this.illinoisAvenue = new ColorTile('Illinois Avenue', 0xed1b24, 240);
    this.bAndORailroad = new RailroadTile('B & O Railroad', 200);
    this.atlanticAvenue = new ColorTile('Atlantic Avenue', 0xf7941d, 260);
    this.ventnorAvenue = new ColorTile('Ventnor Avenue', 0xf7941d, 260);
    this.waterWorks = new UtilityTile('Water Works', 150);
    this.marvinGardens = new ColorTile('Marvin Gardens', 0xf7941d, 280);
    this.goToJail = new GoToJailTile();
    this.pacificAvenue = new ColorTile('Pacific Avenue', 0x00a651, 300);
    this.northCarolinaAvenue = new ColorTile('North Carolina Avenue', 0x00a651, 300);
    this.communityChest3 = new CommunityChest();
    this.pennsylvaniaAvenue = new ColorTile('Pennsylvania Avenue', 0x00a651, 320);
    this.shortLine = new RailroadTile('Short Line', 200);
    this.chance3 = new ChanceTile();
    this.parkPlace = new ColorTile('Park Place', 0x00a2e8, 350);
    this.luxuryTax = new LuxuryTaxTile();
    this.boardwalk = new ColorTile('Boardwalk', 0x00a2e8, 400);
    this.tiles = [
      this.goTile,
      this.mediteraneanAvenue,
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
      this.boardwalk,
    ];
  }

  addTile(tile) {
    this.tiles.push(tile);
  }
}

export class Game {
  constructor(players) {
    this.gameState = {
      players,
    };
  }

  static createPlayer(name) {
    const player = new Player(name);
    return player;
  }

  currentPlayer() {
    return this.gameState.players[0];
  }

  rollDice(playerId) {
    const player = this.gameState.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (player !== this.currentPlayer()) {
      throw new Error('Not your turn');
    }
    if (player.hasRolledDice) {
      throw new Error('You have already rolled the dice');
    }

    player.hasRolledDice = true;

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    player.position += diceRoll;
    if (player.position >= 40) {
      player.position = 0;
      player.money += 200;
    }
  }

  endTurn(playerId) {
    const player = this.gameState.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (player !== this.currentPlayer()) {
      throw new Error('Not your turn');
    }
    if (!player.hasRolledDice) {
      throw new Error('You have not rolled the dice');
    }

    player.hasRolledDice = false;
    this.gameState.players.push(this.gameState.players.shift());
  }

  buyProperty(playerId, propertyId) {
  }
}
