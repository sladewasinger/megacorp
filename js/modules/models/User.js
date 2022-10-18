
export class User {
  constructor(socket) {
    this.socket = socket;
    this.id = socket.id;
    this.name = null;
  }
}
