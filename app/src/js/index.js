import { Engine } from './modules/Engine.js';
const { createApp } = Vue;

const BOARD_TESTING = true;

createApp({
  data() {
    return {
      loaded: false,
      name: '',
      engine: null,
      lobbyId: null,
      bidAmount: 0,
      selectedTrade: null,
      tradeDialogOpen: false,
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
    this.engine = new Engine({
      openTradeDialogCallback: () => {
        console.log('trade dialog opened');
        this.tradeDialogOpen = true;
      },
    });
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


makeDraggable([
  document.getElementById('auction-box'),
  document.getElementById('trade-box'),
  document.getElementById('create-trade-box'),
]);

function makeDraggable(elements) {
  if (!elements || elements.length === 0) {
    return;
  }
  for (let i = 0; i < elements.length; i++) {
    const elmnt = elements[i];
    elmnt._zIndex = (+elmnt.style.zIndex || 0);
    console.log(elmnt._zIndex);
    let endX = 0; let endY = 0; let startX = 0; let startY = 0;

    // Must contain a .header element:
    document.querySelector(`#${elmnt.id} .header`).onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      // e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;

      console.log(elmnt);
      elmnt.style.zIndex = (Math.max(elements.map((x) => +x.style.zIndex)) || 0) + 1;
      for (const element of elements.filter((x) => x !== elmnt)) {
        element.style.zIndex = Math.max(0, (+element.style.zIndex || 0) - 1);
        console.log(elmnt.style.zIndex);
      }
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      endX = startX - e.clientX;
      endY = startY - e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - endY) + 'px';
      elmnt.style.left = (elmnt.offsetLeft - endX) + 'px';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
