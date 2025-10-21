import { Quiz, QuizListItem } from '@queezbud/shared/types';
import { QuizAdapter } from '../../interfaces/QuestionAdapter';
import { inject } from '@angular/core';
import { SOURCE_URL_TOKEN } from '@queezbud/shared/providers/SourceURL.token';

export class FirebaseQuizAdapter implements QuizAdapter {
  SOURCE_URL = inject(SOURCE_URL_TOKEN);

  sourceURL = `${this.SOURCE_URL}quiz/`;

  toSource(quiz: Partial<Quiz>): any {
    const fields: any = {};

    if (quiz.title !== undefined) {
      fields.title = { stringValue: quiz.title };
    }

    if (quiz.quizId !== undefined) {
      fields.id = { stringValue: quiz.quizId };
    }

    if (quiz.description !== undefined) {
      fields.description = { stringValue: quiz.description };
    }

    return {
      fields,
    };
  }

  collectionFromSource(snapshot: any): QuizListItem[] {
    if (!snapshot.documents) {
      return [];
    }
    return snapshot.documents.map(
      (doc: any) => this.fromSource(doc) as QuizListItem
    );
  }

  fromSource(snapshot: any): Partial<QuizListItem> {
    const data = snapshot.fields;

    return {
      quizId: snapshot.name.split('/').pop(),
      title: data.title.stringValue,
      description: data.description.stringValue,
      owner: data.owner?.stringValue || 'unknown',
    };
  }
}
