import { QuizAdapter } from "../interfaces/QuestionAdapter";
import { FirebaseQuizAdapter } from "../adapters/firebase/FirebaseQuizAdapter";


export class QuizFactory {
  static createQuizAdapter(source: string): QuizAdapter {
    switch (source) {
      case 'firebase':
        return new FirebaseQuizAdapter();
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }
}