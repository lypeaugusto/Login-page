import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Bem-vindo ao seu Dashboard</h1>
        <button (click)="logout()" class="btn-logout">Sair</button>
      </header>
      <main class="dashboard-content">
        <div class="user-card">
          <div class="user-avatar">
            <span class="avatar-icon">👤</span>
          </div>
          <div class="user-info">
            <h2>Olá, Usuário!</h2>
            <p>Você está logado e autenticado com sucesso.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
      font-family: 'Inter', sans-serif;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }
    .dashboard-header h1 {
      color: #2d3436;
      font-weight: 700;
    }
    .btn-logout {
      padding: 0.8rem 1.5rem;
      background: #ff7675;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .btn-logout:hover {
      background: #d63031;
      transform: translateY(-2px);
    }
    .user-card {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 2rem;
      max-width: 600px;
    }
    .user-avatar {
      width: 80px;
      height: 80px;
      background: #74b9ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }
    .user-info h2 {
      margin: 0;
      color: #2d3436;
    }
    .user-info p {
      color: #636e72;
      margin-top: 0.5rem;
    }
  `]
})
export class UserComponent {
  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
