
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-sidebar-component.html',
})
export default class QuizSidebarComponent {

  @Output() createQuestion = new EventEmitter<void>();
  onAddQuestion() {
    this.createQuestion.emit();
  }

}