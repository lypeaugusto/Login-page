
import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../componets/default-login-layout/default-login-layout';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DefaultLoginLayout],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {

}
