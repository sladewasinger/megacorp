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
      tradeDialogOpen: false,
      tradeRequest: {
        targetPlayerId: null,
        authorPlayerId: null,
        offer: {
          properties: [],
          money: 0,
        },
        request: {
          properties: [],
          money: 0,
        },
      },
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
    myProperties() {
      return this.engine?.gameState?.tiles.filter((t) => t.owner?.id === this.myPlayer?.id) || [];
    },
    otherPlayerOwnedProperties() {
      return this.engine?.gameState?.tiles
        .filter((t) => !!t.owner)
        .filter((t) => t.owner?.id !== this.myPlayer?.id) || [];
    },
    allPlayersButMe() {
      return this.players.filter((p) => p.id !== this.myPlayer?.id);
    },
    trades() {
      return this.engine?.gameState?.trades || [];
    },
    tradeTargetOwnedProperties() {
      const targetPlayer = this.players.find((p) => p.id === this.tradeRequest?.targetPlayerId);
      if (!targetPlayer) {
        return [];
      }
      return this.engine?.gameState?.tiles.filter((t) => t.owner?.id === targetPlayer.id) || [];
    },
    alreadyOfferedTrade() {
      return this.trades.find((t) => t.authorPlayerId === this.myPlayer?.id);
    },
    myTrades() {
      return this.trades.filter((t) => t.authorPlayerId === this.myPlayer?.id);
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
    createTrade() {
      this.tradeRequest.authorPlayerId = this.myPlayer.id;
      this.engine.createTrade(this.tradeRequest);
    },
    acceptTrade() {
      this.engine.acceptTrade(this.selectedTrade?.id);
      this.selectedTrade = null;
    },
    rejectTrade() {
      this.engine.rejectTrade(this.selectedTrade?.id);
      this.selectedTrade = null;
    },
    cancelAllMyTrades() {
      this.engine.cancelMyTrades();
    },
    tradeRequestNameChanged(e) {
      console.log('resetting trade request');
      this.tradeRequet = {
        targetPlayerId: this.tradeRequest.targetPlayerId,
        offer: {
          properties: [],
          money: 0,
        },
        request: {
          properties: [],
          money: 0,
        },
      };
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

      elmnt.style.zIndex = (Math.max(elements.map((x) => +x.style.zIndex)) || 0) + 1;
      for (const element of elements.filter((x) => x !== elmnt)) {
        element.style.zIndex = Math.max(0, (+element.style.zIndex || 0) - 1);
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
