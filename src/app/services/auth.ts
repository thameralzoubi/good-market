import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  token: string;
  firstName: string;
  lastName: string;
  firstNameChangeTime?: number; // Timestamp of last firstName change
  lastNameChangeTime?: number; // Timestamp of last lastName change
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  // ✅ Getter للوصول للقيمة الحالية بأمان
  get currentUser(): User | null {
    return this.userSubject.value;
  }

  constructor() {
    this.initUserFromToken();
  }

  private getUsers(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  private initUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const users = this.getUsers();
    const user = users.find((u) => u.token === token);

    if (user) {
      this.userSubject.next(user);
    } else {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  register(
    email: string,
    username: string,
    password: string,
    firstName = '',
    lastName = '',
  ): Observable<User> {
    const users = this.getUsers();

    if (users.some((u) => u.email === email)) {
      return throwError(() => new Error('Email already exists'));
    }

    if (users.some((u) => u.username === username)) {
      return throwError(() => new Error('Username already taken'));
    }

    const newUser: User = {
      id: Date.now(),
      email,
      username,
      password,
      token: 'token-' + Date.now(),
      firstName,
      lastName,
      firstNameChangeTime: Date.now(),
      lastNameChangeTime: Date.now(),
    };

    users.push(newUser);
    this.saveUsers(users);

    localStorage.setItem('token', newUser.token);
    this.userSubject.next(newUser);

    return of(newUser).pipe(delay(500));
  }

  login(email: string, password: string): Observable<User> {
    const users = this.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }

    localStorage.setItem('token', user.token);
    this.userSubject.next(user);

    return of(user).pipe(delay(500));
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  updateProfile(updated: Partial<User>) {
    const current = this.userSubject.value;
    if (!current) return;

    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === current.id);
    if (index === -1) return;

    const updatedUser: User = {
      ...current,
      ...updated,
    };

    // Update timestamps for firstName and lastName
    if (updated.firstName !== undefined) {
      updatedUser.firstNameChangeTime = Date.now();
    }
    if (updated.lastName !== undefined) {
      updatedUser.lastNameChangeTime = Date.now();
    }

    users[index] = updatedUser;
    this.saveUsers(users);
    this.userSubject.next(updatedUser);
  }

  isUsernameTaken(username: string): boolean {
    const users = this.getUsers();
    const currentId = this.userSubject.value?.id;
    return users.some((u) => u.username === username && u.id !== currentId);
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
