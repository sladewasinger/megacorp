import { Game } from './Game/Game.js';
import { User } from './models/User.js';

export class Lobby {
  constructor() {
    this.users = [];
    this.game = null;
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

export class Engine {
  constructor(io) {
    this.io = io;
    this.users = [];
    this.lobbies = [];
  }

  start() {
    console.log('Engine started');
    this.io.on('connection', (socket) => {
      console.log('a user connected');
      this.users.add(new User(socket));

      socket.on('disconnect', () => this.userDisconnected(socket));
      socket.on('registerName', (name) => this.registerName(socket, name));
      socket.on('joinLobby', (lobbyId) => this.joinLobby(socket, lobbyId));
    });
  }

  userDisconnected(socket) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    this.users.remove(user);
  }

  registerName(socket, name) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    user.name = name;
  }

  joinLobby(socket, lobbyId) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.name) {
      throw new Error('You have not registered a name');
    }
    const lobby = this.lobbies.find((lobby) => lobby.id === lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    if (lobby.users.length >= 15) {
      throw new Error('Lobby is full');
    }
    lobby.addUser(user);
  }
}
