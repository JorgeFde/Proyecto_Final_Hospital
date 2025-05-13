import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userData = new BehaviorSubject<User | null>(null);
  user$ = this.userData.asObservable();
  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      this.userData.next(user);
    });
  }
  // Funcion para iniciar sesion
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  // Funcion para cerrar sesion
  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/Home']);
    });
  }
  // Funcion para saber si ya inicio sesion
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
