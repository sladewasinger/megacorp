import { io } from "socket.io-client";
import { Board } from "./Board.js";

export class Engine {
  constructor() {
    this.canvas = document.getElementById("canvas");

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    window.addEventListener("resize", this.resize.bind(this));
  }

  start() {
    console.log("start");
    this.socket = io();
    this.socket.on("connect", () => {
      console.log("connected", this.socket.id);
      this.socketId = this.socket.id;
    });

    const container = new PIXI.Container();
    container.scale = new PIXI.Point(0.9, 0.9);
    this.app.stage.addChild(container);

    this.board = new Board();
    this.board.draw(container);

    const square = new PIXI.Graphics();
    square.beginFill(0x00ff00);
    square.drawRect(200, 0, 100, 100);
    square.endFill();
    container.addChild(square);
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
