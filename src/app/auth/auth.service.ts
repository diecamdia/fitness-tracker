import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(private router:Router, private afAuth: AngularFireAuth) {}

  registerUser(authData: AuthData) {
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.authSuccessfully();
    }).catch(error => {
    });
  }

  login(authData: AuthData) {
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(
      authData.email,
       authData.password
     ).then(result => {
        this.authSuccessfully();
     }).catch(error => {
     });
  }

  logout() {
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
