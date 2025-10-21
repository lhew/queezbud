import { Component } from '@angular/core';

@Component({
  selector: 'app-component-a',
  template: `<div style="background: green; color: white; padding: 20px;">
    <h1>Component A</h1>
    <ng-content #child></ng-content>


    
    </div>`

})
export class ComponentA {}
