import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<User | null>;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private snackbar: MatSnackBar
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  lookUpUser(email: string): Observable<boolean> {
    return this.db
      .collection('users', ref => ref.where('email', '==', email))
      .valueChanges()
      .pipe(map(usrs => (usrs.length ? true : false)));
  }

  emailSignUp(email: string, password: string) {
    return this.auth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.updateUserData(user.user);
      })
      .catch(error => this.errorHandler(error));
  }

  loginemail(email: string, password: string) {
    this.auth.auth.signInWithEmailAndPassword(email, password).then(
      user => {
        return this.updateUserData(user.user);
      },
      err => {
        this.errorHandler(err);
      }
    );
  }

  errorHandler(error) {
    this.snackbar.open(error, 'OK');
  }

  updateUserData(user) {
    const userData = {
      email: user.email,
      uid: user.uid,
      name: user.displayName
    };
    this.db.doc(`users/${userData.uid}`).set(userData, { merge: true });
  }

  signOut() {
    this.auth.auth
      .signOut()
      .then(() => {
        this.snackbar.open(`Sesión cerrada`, 'OK', {
          duration: 5000
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}
