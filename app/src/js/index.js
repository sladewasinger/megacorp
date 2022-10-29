import { Engine } from './modules/Engine.js';
const { createApp } = Vue;

const BOARD_TESTING = false;

createApp({
  data() {
    return {
      loaded: false,
      name: '',
      engine: null,
      lobbyId: null,
      bidAmount: 0,
      selectedTrade: null,
      trades: [{
        id: 1,
        name: 'Bubba',
        offer: {
          properties: [
            {
              id: 1,
              name: 'Mediterranean Avenue',
              price: 60,
              color: 'brown',
            },
          ],
          money: 100,
        },
        request: {
          properties: [
            {
              id: 2,
              name: 'Baltic Avenue',
              price: 60,
              color: 'blue',
            },
          ],
          money: 0,
        },
      }],
    };
  },
  computed: {
    user() {
      return this.engine?.user;
    },
    gameRunning() {
      return this.engine?.gameRunning;
    },
    lobby() {
      return this.engine?.lobby;
    },
    players() {
      return this.engine?.gameState?.players || [];
    },
    state() {
      return this.engine?.gameState?.state || 'unknown';
    },
    auctionInProgress() {
      return this.engine?.gameState?.state.name == 'Auction';
    },
    myPlayer() {
      return this.players.find((p) => p.id === this.user.id);
    },
    hasBid() {
      return this.myPlayer?.hasBid;
    },
  },
  mounted() {
    this.engine = new Engine();
    this.engine.start();

    if (BOARD_TESTING) {
      this.engine.registerUser('player 1');
      this.engine.createLobby();
      this.engine.startGame();
    }

    this.loaded = true;
  },
  methods: {
    registerName(e) {
      e.preventDefault();
      this.engine.registerUser(this.name);
    },
    createLobby() {
      this.engine.createLobby(this.lobbyId);
    },
    joinLobby(e) {
      e.preventDefault();
      this.engine.joinLobby(this.lobbyId);
    },
    startGame() {
      this.engine.startGame();
    },
    bid(e) {
      e.preventDefault();
      this.engine.bid(this.bidAmount);
    },
  },
}).mount('#app');


makeDraggable(document.getElementById('auction-box'));
makeDraggable(document.getElementById('trade-box'));
makeDraggable(document.getElementById('create-trade-box'));

function makeDraggable(elmnt) {
  let x1 = 0; let y1 = 0; let x2 = 0; let y = 0;

  // Must contain a .header element:
  document.querySelector(`#${elmnt.id} .header`).onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    x2 = e.clientX;
    y = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    x1 = x2 - e.clientX;
    y1 = y - e.clientY;
    x2 = e.clientX;
    y = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - y1) + 'px';
    elmnt.style.left = (elmnt.offsetLeft - x1) + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
