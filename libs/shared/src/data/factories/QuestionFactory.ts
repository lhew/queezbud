import { QuizQuestionAdapter } from "../../data/interfaces/QuestionAdapter";
import { FirebaseQuizQuestionAdapter } from "../adapters/firebase/FirebaseQuizQuestionAdapter";


export class QuestionFactory {
  static createQuestionAdapter(source: string): QuizQuestionAdapter {
    switch (source) {
      case 'firebase':
        return new FirebaseQuizQuestionAdapter();
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }
};