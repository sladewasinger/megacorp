import { Board } from './Board.js';
const PIXI = window.PIXI;
const io = window.io;

export class Engine {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.reset();

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    window.addEventListener('resize', this.resize.bind(this));
    this.createBoard();
  }

  reset() {
    this.socketId = null;
    this.user = null;
    this.lobby = null;
    this.gameRunning = false;
    this.gameState = null;
  }

  start() {
    console.log('start');
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id);
      this.socketId = this.socket.id;
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected');
      this.reset();
    });
    this.socket.on('lobbyUpdate', (lobby) => {
      console.log('lobbyUpdated', lobby);
      this.lobby = lobby;
    });
    this.socket.on('gameUpdate', async (gameState) => await this.onGameStateUpdate(gameState));
    this.socket.on('diceRoll', (playerId, prevPos, pos) => this.onDiceRoll(playerId, prevPos, pos));
    this.board.socketId = this.socketId;

    this.update();
  }

  async onGameStateUpdate(gameState) {
    console.log('gameUpdated', gameState);
    this.gameState = gameState;
    if (!this.gameRunning) {
      this.gameRunning = true;
    }
  }

  update() {
    if (!this.gameState || !this.gameRunning) {
      requestAnimationFrame(this.update.bind(this));
      return;
    }

    this.board.update(this.gameState);
    window.requestAnimationFrame(this.update.bind(this));
  }

  onDiceRoll(playerId, prevPos, pos) {
    console.log('diceRoll', playerId, prevPos, pos);
    this.board.drawPlayerMoveAnimation(this.gameState, playerId, prevPos, pos);
  }

  registerUser(name) {
    this.socket.emit('registerName', name, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.user = result;
    });
  }

  joinLobby(lobbyId) {
    this.socket.emit('joinLobby', lobbyId, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.lobby = result;
    });
  }

  createLobby(lobbyId) {
    this.socket.emit('createLobby', (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      this.lobby = result;
    });
  }

  startGame() {
    this.socket.emit('startGame', this.lobby.id, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Game started');
      this.gameRunning = true;
    });
  }

  createBoard() {
    const container = new PIXI.Container();
    this.app.stage.addChild(container);
    this.board = new Board(
      this.canvas,
      container,
      this.rollDice.bind(this),
      this.buyProperty.bind(this),
      this.auctionProperty.bind(this),
      this.endTurn.bind(this),
    );
    this.board.draw(container);
  }

  rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    this.socket.emit('rollDice', dice1, dice2, (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      const [number1, number2] = result;
      this.board.dice.setNumber(number1, number2);
      console.log('Dice rolled');
    });
  }

  buyProperty() {
    this.socket.emit('buyProperty', (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Property bought');
    });
  }

  auctionProperty() {
    this.socket.emit('auctionProperty', (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Property auctioned');
    });
  }

  endTurn() {
    this.socket.emit('endTurn', (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Turn ended');
    });
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
