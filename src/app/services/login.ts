import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>("/api/auth/login", { username, password });
  }

  signup(name: string, email: string, password: string): Observable<SignupResponse> {
    return this.httpClient.post<SignupResponse>('/api/auth/register', { name, email, password });
  }
  
}
