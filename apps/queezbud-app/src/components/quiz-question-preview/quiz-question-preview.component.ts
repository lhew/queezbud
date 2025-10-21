import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizQuestion } from '@queezbud/shared/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { iconoirTrash } from '@ng-icons/iconoir';
@Component({
  selector: 'app-quiz-question-preview',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './quiz-question-preview-component.html',

  providers: [provideIcons({ iconoirTrash })],
})
export default class QuizQuestionPreviewComponent {
  @Input() questionIndex = 0;
  @Input() question = {} as QuizQuestion;

  @Output() selectQuestion = new EventEmitter<number>();
  @Output() deleteQuestion = new EventEmitter<number>();

  onSelectQuestion(index: number) {
    this.selectQuestion.emit(index);
  }

  onDeleteQuestion(index: number) {
    this.deleteQuestion.emit(index);
  }
}
