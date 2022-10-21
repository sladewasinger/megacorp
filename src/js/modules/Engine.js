import { User } from './models/User.js';
import { Lobby } from './models/Lobby.js';

export class Engine {
  constructor(io) {
    this.io = io;
    this.users = [];
    this.lobbies = [];
  }

  start() {
    console.log('Engine started');
    this.io.on('connection', (socket) => {
      try {
        console.log('user connected', socket.id);
        this.users.push(new User(socket.id));

        socket.on('disconnect', () => this.userDisconnected(socket.id));
        socket.on('registerName', (name, callbackFn) => this.registerName(socket.id, name, callbackFn));
        socket.on('createLobby', (callbackFn) => this.createLobby(socket.id, callbackFn));
        socket.on('joinLobby', (lobbyId, callbackFn) => this.joinLobby(socket.id, lobbyId, callbackFn));
        socket.on('startGame', (callbackFn) => this.startGame(socket.id, callbackFn));
        socket.on('rollDice', (diceRoll1Override, diceRoll2Override, callbackFn) =>
          this.rollDice(socket.id, diceRoll1Override, diceRoll2Override, callbackFn));
        socket.on('buyProperty', (callbackFn) => this.buyProperty(socket.id, callbackFn));
        socket.on('auctionProperty', (callbackFn) => this.auctionProperty(socket, callbackFn));
        socket.on('endTurn', (callbackFn) => this.endTurn(socket, callbackFn));
        socket.on('Error', (error) => {
          console.log(error);
          socket.emit('Error', error);
        });
      } catch (error) {
        console.log(error);
        socket.emit('Error', error);
      }
    });
  }

  userDisconnected(socketId) {
    const user = this.users.find((user) => user.id === socketId);
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('user disconnected', socketId);
    this.users = this.users.filter((u) => u.id !== user.id);
    this.lobbies.forEach((lobby) => {
      lobby.removeUser(user);
      lobby.users.forEach((user) => {
        console.log('lobbyUpdate, sent to ', user.id);
        this.io.to(user.id).emit('lobbyUpdate', lobby);
      });
    });
    this.lobbies = this.lobbies.filter((lobby) => lobby.users.length > 0);
  }

  registerName(socketId, name, callbackFn) {
    const user = this.users.find((user) => user.id === socketId);
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

  createLobby(socketId, callbackFn) {
    const user = this.users.find((user) => user.id === socketId);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    if (!user.name) {
      callbackFn('You have not registered a name');
      return;
    }
    console.log('createLobby');

    const lobby = new Lobby();
    this.lobbies.push(lobby);
    this.joinLobby(socketId, lobby.id, callbackFn);
    lobby.owner = user;
    callbackFn(null, lobby);
  }

  joinLobby(socketId, lobbyId, callbackFn) {
    const user = this.users.find((user) => user.id === socketId);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    if (!user.name) {
      callbackFn('You have not registered a name');
      return;
    }
    if (!lobbyId) {
      callbackFn('LobbyId is required');
      return;
    }
    const lobby = this.lobbies.find((lobby) => lobby.id.toUpperCase() === lobbyId.toUpperCase());
    if (!lobby) {
      callbackFn('Lobby not found');
      return;
    }
    if (lobby.users.length >= 15) {
      callbackFn('Lobby is full');
      return;
    }

    lobby.addUser(user);

    lobby.users.forEach((user) => {
      console.log('lobbyUpdate, sent to ', user.id);
      this.io.to(user.id).emit('lobbyUpdate', lobby);
    });

    callbackFn(null, lobby);
  }

  startGame(socketId, callbackFn) {
    const user = this.users.find((user) => user.id === socketId);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    const lobby = this.lobbies.find((lobby) => lobby.users.find((u) => u.id === user.id));
    if (!lobby) {
      callbackFn('Lobby not found');
      return;
    }
    if (lobby.owner !== user) {
      callbackFn('You are not the owner of this lobby');
      return;
    }
    lobby.startGame();

    this.emitClientGameStateToLobby(lobby);
    callbackFn(null, this.getClientGameState(lobby, user));
  }

  rollDice(socketId, diceRoll1Override, diceRoll2Override, callbackFn) {
    const user = this.users.find((user) => user.id === socketId);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    const lobby = this.lobbies.find((lobby) => lobby.users.includes(user));
    if (!lobby) {
      callbackFn('Lobby not found');
      return;
    }
    const player = lobby.game.gameState.players.find((player) => player.id === user.id);
    if (!player) {
      callbackFn('You are not in this game');
      return;
    }

    try {
      lobby.game.rollDice(diceRoll1Override, diceRoll2Override);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        callbackFn(error.message);
        return;
      }
      return;
    }

    lobby.users.forEach((user) => {
      console.log('gameUpdate, sent to ', user.id);
      this.io.to(user.id).emit('gameUpdate', this.getClientGameState(lobby, user));
      this.io.to(user.id).emit('diceRoll', player.id, player.prevPosition, player.position);
    });
    callbackFn(null, this.getClientGameState(lobby, user));
  }

  buyProperty(socketId, callbackFn) {
    const user = this.users.find((user) => user.id === socketId);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    const lobby = this.lobbies.find((lobby) => lobby.users.includes(user));
    if (!lobby) {
      callbackFn('Lobby not found');
      return;
    }
    const player = lobby.game.gameState.players.find((player) => player.id === user.id);
    if (!player) {
      callbackFn('You are not in this game');
      return;
    }

    console.log('buyProperty');

    try {
      lobby.game.buyProperty(player.id);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        callbackFn(error.message);
        return;
      }
      callbackFn(error);
      return;
    }
    this.emitClientGameStateToLobby(lobby);
    callbackFn(null, this.getClientGameState(lobby, user));
  }

  auctionProperty(socket, callbackFn) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    const lobby = this.lobbies.find((lobby) => lobby.users.includes(user));
    if (!lobby) {
      callbackFn('Lobby not found');
      return;
    }
    const player = lobby.game.gameState.players.find((player) => player.id === user.id);
    if (!player) {
      callbackFn('You are not in this game');
      return;
    }

    try {
      lobby.game.auctionProperty(player.id);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        callbackFn(error.message);
        return;
      }
      callbackFn(error);
      return;
    }
    this.emitClientGameStateToLobby(lobby);
    callbackFn(null, this.getClientGameState(lobby, user));
  }

  endTurn(socket, callbackFn) {
    const user = this.users.find((user) => user.id === socket.id);
    if (!user) {
      callbackFn('User not found');
      return;
    }
    const lobby = this.lobbies.find((lobby) => lobby.users.includes(user));
    if (!lobby) {
      callbackFn('Lobby not found');
      return;
    }
    const player = lobby.game.gameState.players.find((player) => player.id === user.id);
    if (!player) {
      callbackFn('You are not in this game');
      return;
    }

    console.log('endTurn');
    try {
      lobby.game.endTurn(player.id);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        callbackFn(error.message);
        return;
      }
      callbackFn(error);
      return;
    }
    this.emitClientGameStateToLobby(lobby);
    callbackFn(null, this.getClientGameState(lobby, user));
  }

  emitClientGameStateToLobby(lobby) {
    lobby.users.forEach((user) => {
      console.log('gameUpdate, sent to ', user.id);
      this.io.to(user.id).emit('gameUpdate', lobby.game.getClientGameState(user));
    });
  }

  getClientGameState(lobby, user) {
    return lobby.game.getClientGameState(user);
  }
}
