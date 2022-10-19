import { Engine } from './modules/Engine.js';
const { createApp } = Vue;

createApp({
  data() {
    return {
      name: '',
      engine: null,
      lobbyId: null,
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
  },
  mounted() {
    this.engine = new Engine();
    this.engine.start();
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
  },
}).mount('#app');
