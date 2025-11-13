import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoubtService } from '../../services/doubt.service';
import { AnswerService } from '../../services/answer.service';
import { AuthService } from '../../services/auth.service';
import { Doubt } from '../../models/doubt.model';
import { Answer } from '../../models/answer.model';

@Component({
  selector: 'app-doubt-detail',
  templateUrl: './doubt-detail.component.html',
  styleUrls: ['./doubt-detail.component.css']
})
export class DoubtDetailComponent implements OnInit {
  doubt: Doubt | null = null;
  answers: Answer[] = [];
  answerForm: FormGroup;
  currentUser: any;
  isOwner = false;
  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private doubtService: DoubtService,
    private answerService: AnswerService,
    private authService: AuthService
  ) {
    this.answerForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const doubtId = this.route.snapshot.params['id'];
    this.loadDoubt(doubtId);
    this.loadAnswers(doubtId);
  }

  loadDoubt(doubtId: number): void {
    this.doubtService.getDoubtById(doubtId).subscribe({
      next: (response) => {
        this.doubt = response.doubt;
        this.doubt.id = this.doubt.doubt_id; // Add id alias
        this.doubt.student_id = this.doubt.user_id; // Add student_id alias
        this.isOwner = this.currentUser?.userId === this.doubt.user_id;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doubt:', error);
        this.loading = false;
      }
    });
  }

  loadAnswers(doubtId: number): void {
    this.answerService.getAnswers(doubtId).subscribe({
      next: (response) => {
        this.answers = response.answers;
        // Add id aliases for template compatibility
        this.answers.forEach(answer => {
          answer.id = answer.answer_id;
          answer.user_name = answer.author_name;
          answer.content = answer.answer_text;
        });
      },
      error: (error) => {
        console.error('Error loading answers:', error);
      }
    });
  }

  submitAnswer(): void {
    if (this.answerForm.valid && this.doubt) {
      this.submitting = true;
      const content = this.answerForm.value.content;

      this.answerService.createAnswer(this.doubt.doubt_id, content).subscribe({
        next: () => {
          this.answerForm.reset();
          this.loadAnswers(this.doubt!.doubt_id);
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error posting answer:', error);
          this.submitting = false;
        }
      });
    }
  }

  upvoteAnswer(answerId: number): void {
    this.answerService.voteAnswer(answerId, 'upvote').subscribe({
      next: () => {
        this.loadAnswers(this.doubt!.doubt_id);
      },
      error: (error) => {
        console.error('Error voting:', error);
      }
    });
  }

  downvoteAnswer(answerId: number): void {
    this.answerService.voteAnswer(answerId, 'downvote').subscribe({
      next: () => {
        this.loadAnswers(this.doubt!.doubt_id);
      },
      error: (error) => {
        console.error('Error voting:', error);
      }
    });
  }

  acceptAnswer(answerId: number): void {
    this.answerService.acceptAnswer(answerId).subscribe({
      next: () => {
        this.loadDoubt(this.doubt!.doubt_id);
        this.loadAnswers(this.doubt!.doubt_id);
      },
      error: (error) => {
        console.error('Error accepting answer:', error);
      }
    });
  }

  editDoubt(): void {
    this.router.navigate(['/doubts', this.doubt!.doubt_id, 'edit']);
  }

  deleteDoubt(): void {
    if (confirm('Are you sure you want to delete this doubt?')) {
      this.doubtService.deleteDoubt(this.doubt!.doubt_id).subscribe({
        next: () => {
          this.router.navigate(['/doubts']);
        },
        error: (error) => {
          console.error('Error deleting doubt:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/doubts']);
  }
}
