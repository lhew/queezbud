import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [CommonModule, MatCard, RouterModule, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatList, MatListItem, MatIcon, MatDivider],
  templateUrl: './quizz.component.html',
  styles: [`
    .quizz-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
      display: flex;
      justify-content: center;
    }
    .quiz-card {
      max-width: 800px;
      width: 100%;
    }
    mat-list-item {
      margin-bottom: 10px;
    }
  `]
})
export class QuizzComponent {}
