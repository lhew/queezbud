import { Quiz, QuizQuestion } from '@queezbud/shared/types';

export interface QuizAdapter {
  sourceURL: string;
  toSource(quiz: Partial<Quiz>): any;
  fromSource(snapshot: any): Partial<Quiz>;
  collectionFromSource(snapshot: any): Quiz[];
}

export interface QuizQuestionAdapter {
  sourceURL: string;
  collectionToSource(questions: Partial<QuizQuestion[]>): any;
  collectionFromSource(snapshot: any): QuizQuestion[];
  fromSource(snapshot: any): Partial<QuizQuestion>;
  toSource(question: Partial<QuizQuestion>): any;
}
