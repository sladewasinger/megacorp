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
      resolution: 1, // window.devicePixelRatio || 1,
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
    this.socket.on('playerMovement', (playerId, positions) =>
      this.board.drawPlayerMovement(this.gameState, playerId, positions));
    this.board.socketId = this.socketId;

    this.update();
  }

  async onGameStateUpdate(gameState) {
    console.log('gameUpdated', gameState);
    if (!gameState) {
      console.log('game state is null');
      return;
    }

    this.gameState = gameState;

    if (!this.gameRunning) {
      this.gameRunning = true;
    }

    // if (
    //   (
    //     gameState.currentPlayer?.directMovement ||
    //     gameState.state.name == 'TurnStart' ||
    //     gameState.prevState?.name == 'TurnEnd'
    //   ) &&
    //   (this.board.players?.length ?? 0) > 0 &&
    //   this.board.renderState.lastGameStateProcessed != gameState.id
    // ) {
    //   this.board.drawPlayerMoveAnimation(gameState,
    //     gameState.currentPlayer.id, gameState.currentPlayer.prevPosition, gameState.currentPlayer.position);
    // }
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
    // this.board.drawPlayerMoveAnimation(this.gameState, playerId, prevPos, pos);
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
    this.socket.emit('startGame', (error, result) => {
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
