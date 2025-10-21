import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { iconoirPlus } from '@ng-icons/iconoir';
import { provideIcons, NgIcon } from '@ng-icons/core';
@Component({
  selector: 'app-add-question-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ iconoirPlus })],
  templateUrl: './quizz-add-question-component.html',
})
export default class QuizAddQuestionComponent {}
