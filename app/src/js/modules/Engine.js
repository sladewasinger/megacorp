import { Board } from './Board.js';
const PIXI = window.PIXI;
const io = window.io;

export class Engine {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.canvas.className = 'hidden';

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    window.addEventListener('resize', this.resize.bind(this));
  }

  start() {
    console.log('start');
    this.socket = io();
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id);
      this.socketId = this.socket.id;
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

  createBoard() {
    const container = new PIXI.Container();
    this.app.stage.addChild(container);
    this.board = new Board();
    this.board.draw(container);
    this.canvas.className = '';
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
