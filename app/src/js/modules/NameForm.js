export class NameForm {
  constructor(submittedCallback) {
    this.submittedCallback = submittedCallback;
    this.form = document.querySelector('#registerNameForm');
    this.input = this.form.querySelector('input');
    this.submit = this.form.querySelector('button');
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  onSubmit(e) {
    e.preventDefault();
    this.name = this.input.value;
    this.submittedCallback(this.name);
  }

  hide() {
    this.form.className = 'hidden';
  }
}
