import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toastmessage';
import { AuthService, User } from '../../services/auth';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './profile-settings.html',
  styleUrls: ['./profile-settings.scss'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  activeSection: 'profile' | 'password' | 'delete' = 'profile';

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  usernameValid: boolean | null = null;
  usernameMessage = '';

  currentUser!: User;

  canEditNames: boolean = true;

  private userSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.userSub = this.auth.user$.subscribe((user) => {
      if (!user) return;

      this.currentUser = user;

      if (!this.profileForm) {
        this.initForms(user);
      } else {
        // تحديث القيم حتى لو الفورم موجود
        this.profileForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username,
        });
      }

      this.checkNameEditCooldown();
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  private initForms(user: User) {
    this.profileForm = this.fb.group({
      firstName: [user.firstName || '', Validators.required],
      lastName: [user.lastName || '', Validators.required],
      username: [user.username, Validators.required],
      email: [{ value: user.email, disabled: true }],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.onUsernameInput(user.username);
  }

  private checkNameEditCooldown() {
    const now = Date.now();
    const firstNameTime = this.currentUser.firstNameChangeTime || 0;
    const lastNameTime = this.currentUser.lastNameChangeTime || 0;
    const diff24h = 60 * 1000;

    this.canEditNames = now - firstNameTime > diff24h && now - lastNameTime > diff24h;

    const firstCtrl = this.profileForm.get('firstName');
    const lastCtrl = this.profileForm.get('lastName');

    if (!this.canEditNames) {
      firstCtrl?.disable({ emitEvent: false });
      lastCtrl?.disable({ emitEvent: false });
    } else {
      firstCtrl?.enable({ emitEvent: false });
      lastCtrl?.enable({ emitEvent: false });
    }
  }

  onUsernameInput(value: string) {
    if (!value) {
      this.usernameValid = null;
      this.usernameMessage = '';
      return;
    }

    if (!/^[a-z0-9]+$/.test(value)) {
      this.usernameValid = false;
      this.usernameMessage = 'Only lowercase letters and numbers allowed';
      return;
    }

    if (/^[0-9]/.test(value)) {
      this.usernameValid = false;
      this.usernameMessage = 'Username cannot start with a number';
      return;
    }

    const exists = this.auth
      .getAllUsers()
      .some((u) => u.username === value && u.id !== this.currentUser.id);

    this.usernameValid = !exists;
    this.usernameMessage = exists ? 'Username already taken' : '';
  }

  saveProfile() {
    if (this.usernameValid !== true) {
      this.toast.show('Please fix username errors', 'error');
      return;
    }

    const updatedData: Partial<User> = {
      username: this.profileForm.value.username,
    };

    if (this.canEditNames) {
      updatedData.firstName = this.profileForm.value.firstName;
      updatedData.lastName = this.profileForm.value.lastName;
    }

    this.auth.updateProfile(updatedData);
    this.toast.show('Profile updated successfully', 'success');

    this.checkNameEditCooldown();
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.toast.show('Please fill all password fields', 'error');
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.toast.show('Passwords do not match', 'error');
      return;
    }

    this.auth.updateProfile({ password: newPassword });
    this.passwordForm.reset();
    this.toast.show('Password changed successfully', 'success');
  }

  deleteAccount() {
    this.auth.logout();
    this.toast.show('Account deleted successfully', 'info');
  }
}
