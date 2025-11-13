import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', [Validators.required]],
      department: [''],
      yearOfStudy: ['']
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const email = this.signupForm.get('email')?.value;
    
    // Validate college email domain
    if (!this.authService.isValidCollegeEmail(email)) {
      this.errorMessage = 'Only BMS College email addresses (@bmsce.ac.in) are allowed';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Signup failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
