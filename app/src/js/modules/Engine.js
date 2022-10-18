import { io } from "socket.io-client";

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
    this.socket = io();
    this.socket.on("connect", () => {
      console.log("connected", this.socket.id);
      this.socketId = this.socket.id;
    });
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
