import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupResponse {
    name: string;
    email: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(email: string, password:string){
    return this.httpClient.post("/api/login", { email, password });
  }

  signup(name: string, email: string, password: string): Observable<SignupResponse> {
    return this.httpClient.post<SignupResponse>('/api/signup', { name, email, password });
  }
  
}
