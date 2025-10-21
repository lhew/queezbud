import { inject, Injectable } from '@angular/core';
import {
  QuizForm,
  QuizQuestion,
} from '@queezbud/shared/types';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map, switchMap, take } from 'rxjs';
   import { SOURCE_URL_TOKEN } from '@queezbud/shared/providers/SourceURL.token';

@Injectable({
  providedIn: 'root',
})
export class QuizRepositoryService {
  private http = inject(HttpClient);
  private BASE_URL = inject(SOURCE_URL_TOKEN) + 'quiz';

  listQuizzes() {
    return this.http.get(`${this.BASE_URL}`).pipe(
      take(1),
      map((response: any) => response.data)
    );
  }

async  fetchQuizData(quizId: string) {
    try {
      const response$ = this.http.get(`${this.BASE_URL}/${quizId}/all`);
      return await lastValueFrom(response$);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }

  }

  async createQuiz(title: string) {
    try {
      const response$ = this.http.post(`${this.BASE_URL}`, {
        title,
      });
      return await lastValueFrom(response$);
    } catch (error) {
      console.error('Error creating quiz:', error);
      return null;
    }
  }

  async updateQuiz(quizId: string, quizData: Partial<QuizForm>) {
    return await lastValueFrom(this.http.patch(`${this.BASE_URL}/${quizId}`, quizData));
  }

  async deleteQuiz(quizId: string) {
    return await lastValueFrom(this.http.delete(`${this.BASE_URL}/${quizId}`));
  }

  async createQuestion(quizId: string) {
    try {
      const response$ = await this.http.post(
        `${this.BASE_URL}/${quizId}/questions`, null
      );

      return (await lastValueFrom(response$)) as Partial<QuizQuestion>;
    } catch (error) {
      console.error('Error creating question:', error);
      return null;
    }
  }

  async updateQuestion(
    quizId: string,
    questionId: string,
    questionData: QuizQuestion
  ) {
    try {
      const response$ = await this.http.patch(
        `${this.BASE_URL}/${quizId}/questions/${questionId}`,
        questionData
      );
      return (await lastValueFrom(response$)) as QuizQuestion;
    } catch (e) {
      console.error('Error updating question:', e);
      return null;
    }
  }

  async deleteQuestion(quizId: string, questionId: string) {
    try {
      const response$ = this.http.delete(
        `${this.BASE_URL}/${quizId}/questions/${questionId}`
      );
      await lastValueFrom(response$);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }
}
