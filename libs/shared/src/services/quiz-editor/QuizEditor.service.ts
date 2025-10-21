import { inject, Injectable, signal } from '@angular/core';
import {
  QuizForm,
  QuizQuestion,
  QuizState,
} from '@queezbud/shared/types';
import { QuizRepositoryService } from '../quiz-repository/QuizRepository.service';

@Injectable({
  providedIn: 'root',
})
export class QuizEditorService {
  private quizData = signal<QuizState | null>(null);
  private quizRepository = inject(QuizRepositoryService);
  private loading = signal(false);


  resetState() {
    this.quizData.set(null);

  }


  async fetchQuizData(quizId: string) {
    try {
      this.loading.set(true);
      const quizData = await this.quizRepository.fetchQuizData(quizId) as QuizState;

      console.log('fetched quiz data', quizData);
      this.quizData.set(quizData as QuizState);

      if(quizData?.id && quizData?.questions.length > 0){
        this.setCurrentQuestion(0);
      }

      return quizData;
    } catch (error) {
      console.error('Error creating quiz:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  getQuizData() {
    return this.quizData.asReadonly()();
  }

  setQuizData(quizData: QuizState) {
    this.quizData.set(quizData);
  }

  getCurrentQuestion() {
    return this.quizData
      .asReadonly()()
      ?.questions.find((q) => q.current);
  }

  setCurrentQuestion(index: number) {
    const currentQuiz = this.quizData();
    if (!currentQuiz || !currentQuiz.questions) return;

    this.quizData.set({
      ...currentQuiz,
      questions:
        currentQuiz.questions.map((question, i) => ({
          ...question,
          current: i === index,
        })) || [],
    });
  }

  get isLoading() {
    return this.loading.asReadonly()();
  }

  async createEmptyQuiz(title: string) {
    try {
      this.loading.set(true);
      return await this.quizRepository.createQuiz(title);
    } catch (error) {
      console.error('Error creating quiz:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async createEmptyQuestion() {
    const { id } = this.quizData() || {};
    console.log('quizId', id, this.quizData());
    if (!id) return;

    try {
      this.loading.set(true);
      const createdQuestion = (await this.quizRepository.createQuestion(
        id
      )) as QuizQuestion;

      if (createdQuestion) {
        this.quizData.update((quiz) => {
          if (!quiz) return quiz;
          return {
            ...quiz,
            questions: [
              ...quiz.questions.map((q) => ({ ...q, current: false })),
              { ...createdQuestion, current: true },
            ],
          };
        });
      }
      return createdQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async updateQuestion(
    quizId: string,
    question: QuizQuestion,
    setCurrentIndex?: number
  ) {
    try {
      this.loading.set(true);
      const updatedQuestion = await this.quizRepository.updateQuestion(
        quizId,
        question.id,
        question
      );

      if (updatedQuestion) {
        this.quizData.update((quiz) => {
          if (!quiz) return quiz;
          return {
            ...quiz,
            questions: quiz.questions.map((q, i) => {
              const currentQuestion = q;
              if (setCurrentIndex && setCurrentIndex === i)
                currentQuestion.current = true;
              else q.current = currentQuestion.current || false;

              return q.id === question.id ? updatedQuestion : q;
            }),
          };
        });
      }
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteQuestion(index: number) {
    const currentQuiz = this.quizData();
    const prevQuestion = currentQuiz?.questions[index - 1];
    const nextQuestion = currentQuiz?.questions[index + 1];
    const { id } = currentQuiz?.questions[index] || {};

    if (!currentQuiz?.id || !id) return;
    try {
      this.loading.set(true);

      await this.quizRepository.deleteQuestion(currentQuiz?.id, id);

      this.quizData.update((quiz) => {
        if (!quiz) return quiz;

        return {
          ...quiz,
          questions: quiz.questions.reduce((acc: QuizQuestion[], q, i) => {
            if (i === index) return acc;
            if (prevQuestion && i === index - 1) {
              acc.push({ ...q, current: true });
            } else if (nextQuestion && i === index) {
              acc.push({ ...q, current: true });
            } else {
              acc.push(q);
            }
            return acc;
          }, []),
        };
      });
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteQuiz(quizId: string) {

    try {
      this.loading.set(true);
      await this.quizRepository.deleteQuiz(quizId);
      this.quizData.update((quiz) => {
        if (!quiz) return quiz;
        return {
          ...quiz,
          questions: quiz.questions.filter((q) => q.id !== quizId),
        };
      });
      return true;

    } catch (error) {
      console.error('Error deleting quiz:', error);
      return false;
    } finally {
      this.loading.set(false);
    }

  }

  async updateQuizMetadata(name: string, value: any) {

    const currentQuiz = this.quizData();
    if (!currentQuiz) return;


    try {
      this.loading.set(true);


      console.log('service',{name, value})

      const updatedQuiz = await this.quizRepository.updateQuiz(currentQuiz.id, { [name]: value } as Partial<QuizForm>);

      if(updatedQuiz){
        this.quizData.set({
          ...currentQuiz,
          [name]: value,
        });

      }
      
    }catch(error) {
      console.error('Error updating quiz metadata:', error);
    }finally{
      this.loading.set(false);
    }
  }

  updateQuiz(currentQuizForm: QuizForm) {
    const { alternatives, title, description } = currentQuizForm;



    this.quizData.update((currentQuiz) => {
      if (!currentQuiz) return currentQuiz;
      return {
        ...currentQuiz,
        title,
        description,
        questions: (currentQuiz?.questions).map((q) => {
          return q.current
            ? {
                ...q,
                question: currentQuizForm.question,
                alternatives,
              }
            : q;
        }),
      };
    });
  }
}
