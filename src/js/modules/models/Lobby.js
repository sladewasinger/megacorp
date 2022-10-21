import { Game } from '../Game/Game.js';
import { randomUUID } from 'crypto';


export class Lobby {
  constructor() {
    // generate random 4 letter key
    this.id = randomUUID().substring(0, 4);
    this.users = [];
    this.game = null;
    this.owner = null;
  }

  startGame() {
    const players = this.users.map((user) => Game.createPlayer(user.id, user.name));
    this.game = new Game(players);
    this.game.startGame();
  }

  addUser(user) {
    this.users.push(user);
  }

  removeUser(user) {
    this.users = this.users.filter((u) => u.id !== user.id);
  }

  getUserById(id) {
    return this.users.find((u) => u.id === id);
  }
}
