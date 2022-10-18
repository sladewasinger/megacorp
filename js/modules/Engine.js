export class Engine {
  constructor(io) {
    this.io = io;
  }

  start() {
    console.log('Engine started');
    this.io.on('connection', (socket) => {
      console.log('a user connected');
    });
  }
}
