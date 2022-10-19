export class LobbyForm {
  constructor(submittedCallback) {
    this.submittedCallback = submittedCallback;
    this.form = document.querySelector('#registerLobbyForm');
    this.input = this.form.querySelector('input');
    this.submit = this.form.querySelector('button');
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  onSubmit(e) {
    e.preventDefault();
    this.lobby = this.input.value;
    this.submittedCallback(this.lobby);
  }

  hide() {
    this.form.className = 'hidden';
  }

  show() {
    this.form.className = '';
  }
}
