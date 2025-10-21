import { Component, inject, signal, OnDestroy, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import QuizSidebarComponent from '../../../../components/quiz-sidebar/quiz-sidebar.component';
import QuizAlternativeComponent from '../../../../components/quiz-alternative/quiz-alternative.component';
import QuizQuestionPreviewComponent from '../../../../components/quiz-question-preview/quiz-question-preview.component';
import { HttpClient } from '@angular/common/http';
import { CookieService } from '@queezbud/shared/services/cookie/cookie.service';
import { QuizEditorService } from '@queezbud/shared/services/quiz-editor/QuizEditor.service';
import {
  QuizAlternative,
  QuizForm,
  QuizQuestion,
  QuizState,
} from '@queezbud/shared/types';

@Component({
  selector: 'app-quiz-create-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    QuizSidebarComponent,
    ReactiveFormsModule,
    QuizAlternativeComponent,
    QuizQuestionPreviewComponent,
  ],
  templateUrl: './quiz-create-component.html',
})
export class QuizCreateComponent implements OnDestroy {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  quizService = inject(QuizEditorService);
  route = inject(ActivatedRoute);

  loadingError = signal('');

  form = this.fb.group({
    quizId: '',
    idle: [true],
    title: ['', { updateOn: 'blur' }],
    description: ['', { updateOn: 'blur' }],
    question: ['', { updateOn: 'blur' }],
    questionId: 'idle',
    alternatives: this.fb.array([
      this.fb.group({
        alternative: ['', { updateOn: 'blur' }],
        isCorrect: false,
        id: [`idle`, { updateOn: 'blur' }],
      }),
    ]),
  });



  

  constructor() {
    this.route.params.subscribe((params) => {
      if (!params['quizId']) {
        this.loadingError.set('No quiz ID provided in the route.');
        return;
      }

      this.quizService.fetchQuizData(params['quizId'])


      let hasRun = false;
      effect(() => {
        if (hasRun) return;
        const quizData = this.quizService.getQuizData();
        if (quizData?.id && this.form.get('idle')?.value) {
          hasRun = true;
          console.log('Quiz data loaded:', quizData);

          this.updateForm({
        idle: false,
        title: quizData.title,
        description: quizData.description,
        question: quizData.questions?.[0]?.question || '',
        questionId: quizData.questions?.[0]?.id || '',
        alternatives: quizData.questions?.[0]?.alternatives || [],
        quizId: quizData.id,
          });
        }
      });


    });
  }

  ngOnDestroy() {
    this.form.reset();
    this.quizService.resetState();
  }


  areAlternativesEqual() {
    

    const formAlternatives = (this.form.get('alternatives') as FormArray).value as QuizAlternative[];
    const currentQuestion = this.quizService.getCurrentQuestion()?.alternatives || [];

    if (formAlternatives.length !== currentQuestion.length) return false;

    for (let i = 0; i < formAlternatives.length; i++) {
      if (
        formAlternatives[i].alternative !== currentQuestion[i].alternative ||
        formAlternatives[i].isCorrect !== currentQuestion[i].isCorrect
      ) {
        return false;
      }
    }

    return true;


  }

  get isLoading() {
    return this.quizService.isLoading;
  }

  get isFormDirty() {
    return this.form.dirty;
  }

  get isQuestionDirty() {
    return this.form.get('question')?.dirty;
  }

  get areAlternativesDirty() {
    const alternatives = this.form.get('alternatives') as FormArray;

    if (alternatives.length === 0) return false;

    return alternatives.controls.filter((control) => control.dirty).length > 0;
  }

  get formAlternatives() {
    return (this.form.get('alternatives') as FormArray).controls;
  }

  getAlternativeFormGroup(index: number) {
    return (this.form.get('alternatives') as FormArray).at(index) as FormGroup;
  }

  updateForm(quizForm: Partial<QuizForm & {idle: boolean}>) {
    if (quizForm) {
      this.form.patchValue({
        title: quizForm.title ,
        description: quizForm.description ,
        question: quizForm.question ,
        questionId: quizForm.questionId ,
      });

      const formAlternatives = this.form.get('alternatives') as FormArray;
      formAlternatives.clear();

      (quizForm?.alternatives || [])?.forEach((alt: QuizAlternative) => {
        formAlternatives.push(
          this.fb.group({
            alternative: [alt.alternative, { updateOn: 'blur' }],
            isCorrect: alt.isCorrect,
            id: [alt.id, { updateOn: 'blur' }],
          })
        );
      });

      this.form.markAsUntouched();
      this.form.markAsPristine();
    }
  }

  updateQuizMetadata($event: Event) {
    const input = $event.target as HTMLInputElement;
    const controlName = input.getAttribute('formControlName') as 'title' | 'description';


    console.log({input, controlName})

    if (!controlName) return;

    const formValue = this.form.get(controlName)?.value?.trim();
    const inputValue = input.value.trim();

    const previousValue = this.quizService.getQuizData()?.[controlName]?.trim();

    console.log('updating quiz metadata', {controlName, formValue, previousValue});

    if (formValue !== inputValue) {
      // this.form.get(controlName)?.setValue(inputValue);
      this.quizService.updateQuizMetadata(controlName, inputValue);
    }
  }

  addAlternative() {
    (this.form.get('alternatives') as FormArray)?.push(
      this.fb.group({
        alternative: '',
        isCorrect: false,
        id: `alt-${Date.now()}`,
      })
    );
  }

  async createQuestion() {
    console.log('creating question');
    await this.quizService.createEmptyQuestion();

    const lastQuestion = this.quizService.getQuizData()?.questions?.find(q => q.current);

    console.log(' lastQuestion', lastQuestion);
    if (lastQuestion) {


      this.updateForm({
        question: lastQuestion.question || ' ',
        questionId: lastQuestion.id,
        alternatives: lastQuestion.alternatives,
      });


    }

  }

  get isIdle(){
    return this.form.get('idle')?.value;
  }

  async selectQuestion(index: number) {
    const { questions, ...quizData } = (this.quizService.getQuizData() ||
      {}) as QuizState;

    const selectedQuestion = questions[index] as QuizQuestion;
    
    const { questionId, question, alternatives } = this.form.value;

    if (this.areAlternativesDirty || this.isQuestionDirty) {

      if (questionId  && alternatives) {
        await this.quizService.updateQuestion(quizData.id, {
          id: questionId,
          question: question || '',
          alternatives: (alternatives || []) as QuizAlternative[],
        });
      }

      
    } else {
      this.quizService.setCurrentQuestion(index);
    }
    
    this.updateForm({
      questionId: selectedQuestion.id,
      question: selectedQuestion.question || ' ',
      alternatives: selectedQuestion.alternatives,
    });


    if(this.form.get('question')?.value === ''){
      console.log(' resetting question')
      this.form.get('question')?.reset('')
    }
  }

  async deleteQuestion(index: number) {

    try {
      await this.quizService.deleteQuestion(index);
      const { question, alternatives, id } =
        this.quizService.getCurrentQuestion() || {} as QuizQuestion;

      this.updateForm({
        question,
        alternatives,
        questionId: id,
      });
    } catch (e) {
      console.error('Error deleting question:', e);
    }
  }

  deleteAlternative(index: number) {
    const alternativesArray = this.form.get('alternatives') as FormArray;
    alternativesArray.removeAt(index);
  }
}
