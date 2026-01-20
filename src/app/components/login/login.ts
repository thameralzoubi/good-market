import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toastmessage';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  form!: FormGroup;
  showPassword = false;
  loading = false;

  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  closeModalClick() {
    this.close.emit();
  }

  submit() {
    if (this.form.invalid) {
      if (this.form.get('email')?.invalid) {
        this.toast.show('Please enter a valid email!', 'error');
      } else if (this.form.get('password')?.invalid) {
        this.toast.show('Password must be at least 6 characters!', 'error');
      }
      return;
    }

    const { email, password } = this.form.value;
    this.loading = true;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.toast.show('Login successful!', 'success');
        this.router.navigate(['/']);
        this.closeModalClick();
      },
      error: (err) => {
        this.loading = false;
        this.toast.show(err.message, 'error');
      },
    });
  }
}
