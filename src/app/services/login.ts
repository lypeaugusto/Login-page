import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SignupResponse {
  token: string;
}

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  signup(name: string, email: string, password: string): Observable<SignupResponse> {
    return this.httpClient.post<SignupResponse>(`${this.apiUrl}/auth/register`, { name, email, password });
  }

}
