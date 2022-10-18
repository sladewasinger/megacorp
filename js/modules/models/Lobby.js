import { Game } from '../Game/Game.js';


export class Lobby {
  constructor() {
    this.users = [];
    this.game = null;
    this.owner = null;
  }

  startGame() {
    const players = this.users.map((user) => Game.createPlayer(user.name, user.id));
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
