import { inject, Injectable, signal } from '@angular/core';
import {  QuizListItem } from '@queezbud/shared/types';
import { QuizRepositoryService } from '../quiz-repository/QuizRepository.service';

@Injectable({
  providedIn: 'root',
})
export class QuizListService {
  private quizData = signal<{loading: boolean, data: QuizListItem[] | null, error: any}>({loading: false, data: [], error: null});
  private quizRepository = inject(QuizRepositoryService);

  fetchQuizData() {
 
    this.quizData.set({loading: true, data: null, error: null});
    return this.quizRepository.listQuizzes().subscribe({
      next: (quizData) =>  {
         this.quizData.set({loading: false, data: quizData as QuizListItem[], error: null});
      },
      error: (error) => this.quizData.set({loading: false, data: null, error}),
    });

  }
  getQuizData() {
    return this.quizData.asReadonly()();
  }

}
