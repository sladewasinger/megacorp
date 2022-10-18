import { io } from 'socket.io-client';
import { Board } from './Board.js';
const PIXI = window.PIXI;

export class Engine {
  constructor() {
    this.canvas = document.getElementById('canvas');

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

    const container = new PIXI.Container();
    this.app.stage.addChild(container);

    this.board = new Board();
    this.board.draw(container);
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
