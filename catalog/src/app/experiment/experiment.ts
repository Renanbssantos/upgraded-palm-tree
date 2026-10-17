import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-experiment',
  template: `
    <p id="exp">Plain: {{ plainCounter }} | Signal: {{ signalCounter() }}</p>
    <button (click)="signalCounter.set(signalCounter() + 1)">Bump signal</button>
  `,
})
export class Experiment {
  plainCounter = 0;
  signalCounter = signal(0);
  constructor() {
    setInterval(() => this.plainCounter++, 1000); // Angular is never told about this change
  }
}
