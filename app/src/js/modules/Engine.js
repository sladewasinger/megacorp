import { Board } from './Board.js';
const PIXI = window.PIXI;
const io = window.io;

export class Engine {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.canvas.className = 'hidden';
    this.reset();

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    window.addEventListener('resize', this.resize.bind(this));
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
    this.socket.on('gameUpdate', (gameState) => {
      console.log('gameUpdated', gameState);
      if (!this.gameRunning) {
        this.gameRunning = true;
        this.createBoard();
      }
      this.gameState = gameState;
    });
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
      this.createBoard();
    });
  }

  createBoard() {
    const container = new PIXI.Container();
    this.app.stage.addChild(container);
    this.board = new Board(this.canvas);
    this.board.draw(container);
    this.canvas.className = '';
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
