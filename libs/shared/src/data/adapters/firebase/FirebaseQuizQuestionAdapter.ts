import { QuizQuestion } from "@queezbud/shared/types";
import { QuizQuestionAdapter } from "../../interfaces/QuestionAdapter";


export class FirebaseQuizQuestionAdapter implements QuizQuestionAdapter {
  sourceURL = 'https://firestore.googleapis.com/v1/projects/queezbud/databases/queezbud-db/documents/quiz/';

  collectionFromSource(snapshot: any) {
    return snapshot.documents?.map((document: any) => this.fromSource(document));
  }

  collectionToSource(questions: QuizQuestion[]) {
    return {
      fields: {
        questions: {
          arrayValue: {
            values: questions.map(question => this.toSource(question)),
          },
        },
      },
    };
  }

  toSource(question: Partial<QuizQuestion>) {
    return {
      fields: {
        id: { stringValue: question.id },
        question: { stringValue: question.question },
        alternatives: {
          arrayValue: {
            values: (question.alternatives || []).map(alt => ({
              mapValue: {
                fields: {
                  alternative: { stringValue: alt.alternative },
                  isCorrect: { booleanValue: alt.isCorrect },
                },
              },
            })),
          },
        },
      },
    };
  }

  fromSource(snapshot: any): QuizQuestion {
    const data = snapshot.fields;
    const id = snapshot.name.split('/').pop();
    return {
      id,
      question: data.question.stringValue,
      alternatives: data.alternatives.arrayValue?.values?.map((alt: any, index: number) => ({
        id: id + index,
        alternative: alt.mapValue.fields.alternative.stringValue,
        isCorrect: alt.mapValue.fields?.isCorrect?.booleanValue || false,
      })) || [],
    };
  }
}
