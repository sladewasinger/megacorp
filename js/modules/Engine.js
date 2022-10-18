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
      console.log('user connected', socket.id);
      this.users.push(new User(socket.id));

      socket.on('disconnect', () => this.userDisconnected(socket));
      socket.on('registerName', (name, callbackFn) => this.registerName(socket, name, callbackFn));
      socket.on('createLobby', (callbackFn) => this.createLobby(socket, callbackFn));
      socket.on('joinLobby', (lobbyId, callbackFn) => this.joinLobby(socket, lobbyId, callbackFn));
      socket.on('startGame', (lobbyId, callbackFn) => this.startGame(socket, lobbyId, callbackFn));
      socket.on('Error', (error) => {
        console.log(error);
        socket.emit('Error', error);
      });
    });
  }

  userDisconnected(socket) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('user disconnected', socket.id);
    this.users = this.users.filter((u) => u.id !== user.id);
  }

  registerName(socket, name, callbackFn) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    if (user.name) {
      callbackFn('Name already registered');
      return;
    }
    console.log('registerName', name);
    user.name = name;
    callbackFn(null, user);
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
