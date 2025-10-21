import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-quiz-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-main-component.html',
})
export class QuizMainComponent {

  showAddQuiz = false;
  route = inject(ActivatedRoute);



  
  ngChanges() {
    this.route.url.subscribe(() => {
      console.log('Route changed:', this.route.snapshot.url.map(segment => segment.path).join('/'));
    });
    
  }
}
