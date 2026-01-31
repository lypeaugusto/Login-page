import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
    id?: number;
    text: string;
    completed: boolean;
}

export interface UserProfile {
    name: string;
    email: string;
    favoriteCity: string;
    todos: Todo[];
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/user';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getUserProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
    }

    updateCity(city: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/city`, city, { headers: this.getHeaders() });
    }

    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(`${this.apiUrl}/todos`, { headers: this.getHeaders() });
    }

    addTodo(todo: Todo): Observable<Todo> {
        return this.http.post<Todo>(`${this.apiUrl}/todos`, todo, { headers: this.getHeaders() });
    }

    updateTodo(todo: Todo): Observable<Todo> {
        return this.http.put<Todo>(`${this.apiUrl}/todos/${todo.id}`, todo, { headers: this.getHeaders() });
    }

    deleteTodo(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/todos/${id}`, { headers: this.getHeaders() });
    }

    updateProfile(name: string, email: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/update`, { name, email }, { headers: this.getHeaders() });
    }
}
