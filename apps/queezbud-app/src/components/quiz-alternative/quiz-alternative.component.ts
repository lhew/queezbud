import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { iconoirTrash } from '@ng-icons/iconoir';

@Component({
  selector: 'app-quiz-alternative',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIcon, ReactiveFormsModule],
  viewProviders: [
    provideIcons({
      iconoirTrash,
    }),
  ],
  templateUrl: './quiz-alternative-component.html',
})
export default class QuizAlternativeComponent {
  @Input() alternative!: FormGroup;
  @Input() index!: number;
  @Output() deleteAlternative = new EventEmitter<number>();

  onDelete() {
    this.deleteAlternative.emit(this.index);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
