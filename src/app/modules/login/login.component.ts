import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = ''
  password: string = ''

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  login() {
    const user = {email: this.email, password: this.password};
    this.authService.loginWithPass(user.email, user.password).then(
      data => {
      console.log(data)
      this.router.navigate(['product']);
    }).catch( error => {

      //this.toast.errorMessage('Error de login', 'Usuario o contraseña incorrecta')
      console.log(error);
    });
  }

}
