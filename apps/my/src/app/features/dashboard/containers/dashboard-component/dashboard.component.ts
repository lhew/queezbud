import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCard, MatCardHeader, MatFormFieldModule, MatCardTitle, MatInputModule, MatCardSubtitle, MatCardContent, MatListItem, MatIcon, MatCardActions, MatList],
  templateUrl: './dashboard.component.html'
  
})
export class DashboardComponent {
  constructor(){
    console.log('HEYA')
  }
}
