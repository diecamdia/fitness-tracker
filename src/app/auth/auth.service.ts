import { UIService } from './../shared/ui.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import { Subject } from 'rxjs/Subject';
import { TrainingService } from './../training/training.service';
import { User } from "./user.model";
import { AuthData } from "./auth-data.model";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean;

  constructor(
    private router:Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingSateChanged.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
    this.uiService.loadingSateChanged.next(false);
    }).catch(error => {
      this.uiService.loadingSateChanged.next(false);
      this.uiService.showSnackbar(error.message,null,3000);
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingSateChanged.next(true);
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(
      authData.email,
       authData.password
     ).then(result => {
      this.uiService.loadingSateChanged.next(false);
     }).catch(error => {
      console.log(error);
      this.uiService.loadingSateChanged.next(false);
      this.uiService.showSnackbar(error.message,null,3000);
     });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
