import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Login } from '../login/login';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth';
import { ToastService } from '../../services/toastmessage';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, Login, CommonModule, LucideAngularModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  showLoginModal = false;
  showPassword = false;
  showConfirmPassword = false;

  usernameValid: boolean | null = null;
  usernameMessage: string = '';

  constructor(
    private toast: ToastService,
    private authService: AuthService,
  ) {}

  openLoginModal() {
    this.showLoginModal = true;
  }
  closeLoginModal() {
    this.showLoginModal = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ✅ Username input handler
  onUsernameInput(value: string) {
    if (!value) {
      this.usernameValid = null;
      this.usernameMessage = '';
      return;
    }

    const regex = /^[a-z0-9]+$/;
    if (!regex.test(value)) {
      this.usernameValid = false;
      this.usernameMessage = 'Only lowercase letters and numbers allowed';
      return;
    }

    if (/^[0-9]/.test(value)) {
      this.usernameValid = false;
      this.usernameMessage = 'Username cannot start with a number';
      return;
    }

    const users: User[] = this.authService.getAllUsers();
    if (users.some((u) => u.username === value)) {
      this.usernameValid = false;
      this.usernameMessage = 'Username already taken';
    } else {
      this.usernameValid = true;
      this.usernameMessage = '';
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid || this.usernameValid === false) {
      this.toast.show('Please fill all fields correctly!', 'error');
      return;
    }

    const { firstName, lastName, email, username, password, confirmPassword } = form.value;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      this.toast.show('Please fill all required fields!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.toast.show('Passwords do not match!', 'error');
      return;
    }

    this.authService.register(email, username, password, firstName, lastName).subscribe({
      next: () => {
        this.toast.show('Account created successfully!', 'success');
        form.reset();
        this.usernameValid = null;
        this.openLoginModal();
      },
      error: (err) => this.toast.show(err.message, 'error'),
    });
  }
}
