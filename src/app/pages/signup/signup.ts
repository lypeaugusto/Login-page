import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../componets/default-login-layout/default-login-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Primaryinput } from '../../componets/primaryinput/primaryinput';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from './password-validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayout,
    ReactiveFormsModule,
    Primaryinput,
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
  providers: [
    LoginService
  ]
})
export class SignupComponent {

  signupForm: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirmation: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, {
      validators: passwordValidator()
    });
  }

  // botão principal (cadastrar)
  onSubmit() {
    this.loginService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password).subscribe({
      next: () => {
        this.toastService.success("Register successful");
        this.router.navigate(['/login']);
      },
      error: () => this.toastService.error("Register failed! Try again later.")
    });
  }

  // botão secundário (navigate)
  onNavigate() {
    this.router.navigate(['/login']);
  }
}
