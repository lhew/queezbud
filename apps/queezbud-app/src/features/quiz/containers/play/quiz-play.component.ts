import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-quiz-play-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-play-component.html',
})
export class QuizPlayComponent {}
