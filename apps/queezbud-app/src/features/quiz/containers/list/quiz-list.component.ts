import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,

} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuizListService } from '@queezbud/shared/services/quiz-list/QuizList.service';
import { QuizEditorService } from '@queezbud/shared/services/quiz-editor/QuizEditor.service';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { iconoirTrash } from '@ng-icons/iconoir';


@Component({
  selector: 'app-quiz-list-component',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIcon],
  viewProviders: [provideIcons({ iconoirTrash })],
  templateUrl: './quiz-list-component.html',
})
export class QuizListComponent implements AfterViewInit {
  quizListService = inject(QuizListService);
  quizService = inject(QuizEditorService);
  showCreateQuizModal = signal(false);
  quizToDelete = signal({ id: '', title: '' });
  createQuizModal = signal(false);

  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('deleteQuizDialogRef') deleteDialogRef!: ElementRef<HTMLDialogElement>;

  constructor() {
    this.quizListService.fetchQuizData();
  }

  openDialog() {
    this.dialogRef.nativeElement.showModal();
  }

  closeDialog() {
    this.dialogRef.nativeElement.close();
  }


  openCreateQuizDialog() {
    this.createQuizModal.set(true);
    this.openDialog();
  }

  closeCreateQuizDialog() {
    this.createQuizModal.set(false);
    this.quizToDelete.set({ id: '', title: '' });
    this.closeDialog();
  }


  ngAfterViewInit() {
    this.dialogRef.nativeElement.addEventListener('close', () => {

      setTimeout(() => {
        this.createQuizModal.set(false);
        this.quizToDelete.set({ id: '', title: '' });
      }, 300);
    });

  }

  createQuiz(titleInput: HTMLInputElement, $event: Event) {

    $event.preventDefault();
    this.quizService.createEmptyQuiz(titleInput.value).then(() => {
      titleInput.value = '';
      this.closeDialog();
      this.quizListService.fetchQuizData();
    });
  }

  deleteQuiz(quizId: string, $event: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.deleteQuiz(quizId).then(() => {
        this.quizListService.fetchQuizData();
      });
    }
  }

  confirmDelete() {
    console.log('deleting quiz', this.quizToDelete());
    this.quizService.deleteQuiz(this.quizToDelete().id).then(() => {
      this.quizListService.fetchQuizData();

      this.closeDialog();
    });
  }
  
  openDeleteDialog(quizId: string, quizTitle: string) {
    this.quizToDelete.set({ id: quizId, title: quizTitle });
    this.createQuizModal.set(false);
    this.openDialog();
  }

  closeDeleteDialog() {
    this.deleteDialogRef?.nativeElement.close();
  }

  
}
