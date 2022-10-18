import { User } from './models/User.js';

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
      this.users.push(new User(socket));

      socket.on('disconnect', () => this.userDisconnected(socket));
      socket.on('registerName', (name) => this.registerName(socket, name));
      socket.on('createLobby', () => this.createLobby(socket));
      socket.on('joinLobby', (lobbyId) => this.joinLobby(socket, lobbyId));
      socket.on('startGame', (lobbyId) => this.startGame(socket, lobbyId));
      socket.on('Error', (error) => {
        console.log(error);
        socket.emit('Error', error);
      });
    });
  }

  userDisconnected(socket) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    this.users = this.users.filter((u) => u.id !== user.id);
  }

  registerName(socket, name) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    user.name = name;
  }

  createLobby(socket) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.name) {
      throw new Error('You need to register a name first');
    }

    const lobby = new Lobby();
    this.lobbies.add(lobby);
    this.joinLobby(socket, lobby.id, owner = true);
  }

  joinLobby(socket, lobbyId, owner = false) {
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
    if (owner) {
      lobby.owner = user;
    }
  }

  startGame(socket, lobbyId) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      throw new Error('User not found');
    }
    const lobby = this.lobbies.find((lobby) => lobby.id === lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    if (lobby.owner !== user) {
      throw new Error('You are not the owner of this lobby');
    }
    lobby.startGame();
  }
}
