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


console.log('here');
// Make the DIV element draggable:
dragElement(document.getElementById('auction-box'));

function dragElement(elmnt) {
  let pos1 = 0; let pos2 = 0; let pos3 = 0; let pos4 = 0;

  document.querySelector(`#${elmnt.id} .header`).onmousedown = dragMouseDown;


  function dragMouseDown(e) {
    e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
    elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
