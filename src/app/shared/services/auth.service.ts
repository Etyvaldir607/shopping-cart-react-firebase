import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.interface';

@Injectable()
export class AuthService {

  userData: User | any;

  constructor(private afireAuth: AngularFireAuth,
              private afireFirestore: AngularFirestore,
              private router: Router) {
      this.afireAuth.authState.subscribe(user => {
          if (user) {
            this.userData = user;
            localStorage.setItem('user', JSON.stringify(this.userData))
          } else {
            localStorage.setItem('user', 'null')
          }
      });
  }

  // login with email and password
  async loginWithPass(email: any, password: any){
    return this.afireAuth.signInWithEmailAndPassword(email, password)
      .then((credential) => {
        this.userData = credential.user
        this.observeUserState()
      }).catch((err) => {
        console.log("error pass: " + err)
        this.router.navigate(['login'])
      })
  }

  // login with user data to firestore
  async loginWithPassFireStore(email: any, password: any){
      this.userData = this.afireAuth.authState.subscribe(user => {
        if (user) {
          return this.afireFirestore.doc<User>(`user/${user.uid}`).valueChanges()
        } else {
          return Observable<null>
        }
      })
  }

  get isLoginIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!)
    return user !== null;
  }

  async logOut() {
    this.afireAuth.signOut().then(()=> {
      localStorage.removeItem('user')
      //this.router.navigate(['login'])
    })
  }

  observeUserState() {
    this.afireAuth.authState.subscribe((userState) => {
      userState
    })
  }

  private updateUserData(user: any) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afireFirestore.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        subscriber: true
      }
    }
    return userRef.set(data, { merge: true })
  }


  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    console.log(allowedRoles.some( (role) =>  Object.keys(user.roles).some(roleUser => roleUser == role) ))
    if (allowedRoles.some( (role) =>  Object.keys(user.roles).some(roleUser => roleUser == role) )) {
      return true
    }
    return false
  }
}
