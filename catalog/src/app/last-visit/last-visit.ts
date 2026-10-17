import { Component, afterNextRender } from '@angular/core';
@Component({ selector: 'app-last-visit', template: `` })
export class LastVisit {
  constructor() {
    afterNextRender(() => {
      localStorage.setItem('lastVisit', new Date().toISOString());
    });
  }
}
