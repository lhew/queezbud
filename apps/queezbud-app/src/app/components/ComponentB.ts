import { Component } from '@angular/core';

@Component({
  selector: 'app-component-b',
  template: `<div style="background: red; color: white; padding: 20px;">
    <h1>Component B</h1>
    <ng-content>

    </ng-content>
    
    </div>`
})
export class ComponentB {}
