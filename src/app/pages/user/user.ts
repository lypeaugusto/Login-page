import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { UserService, Todo } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container" [class.dark-mode]="themeService.darkMode()">
      <header class="dashboard-header">
           <img src="/assets/logo.svg" alt="Logo">
        <div class="header-actions">
          <button (click)="themeService.toggleDarkMode()" class="btn-dark-mode">
            @if (themeService.darkMode()) {
              <span>☀️ Light Mode</span>
            } @else {
              <span>🌙 Dark Mode</span>
            }
          </button>
          <button (click)="logout()" class="btn-logout">Sair</button>
        </div>
      </header>

      <main class="dashboard-content">
        <div class="top-section">
          <div class="user-card">
            <div class="user-avatar">
              <img *ngIf="userPicture" [src]="apiUrl + userPicture" alt="Avatar" class="avatar-img">
              <span *ngIf="!userPicture" class="avatar-icon">👤</span>
            </div>
            <div class="user-info">
              <h2>Olá, {{ userName }}!</h2>
              <p>Você está logado e autenticado.</p>
              <button (click)="goToEditProfile()" class="btn-edit-profile">⚙️ Editar Perfil</button>
            </div>
          </div>

          <div class="weather-section">
            <div class="city-search">
              <input 
                type="text" 
                [(ngModel)]="searchInput" 
                (keyup.enter)="previewWeather(searchInput)"
                placeholder="Buscar novas cidades..."
                class="search-input"
              >
              <button (click)="previewWeather(searchInput)" class="btn-search-city">🔍</button>
            </div>

            <!-- Previsão das Cidades Favoritas -->
            <div class="favorite-cities-list">
              @for (weather of favoriteCitiesWeather; track weather.id) {
                <div class="weather-card fav-card">
                  <div class="weather-main">
                    <span class="weather-temp">{{ weather.main.temp | number:'1.0-0' }}°C</span>
                    <div class="weather-details">
                      <span class="weather-city">{{ weather.name }}</span>
                      <span class="weather-desc">{{ weather.weather[0].description }}</span>
                    </div>
                  </div>
                  <div class="weather-icon">{{ getWeatherEmoji(weather.weather[0].main) }}</div>
                  <button (click)="removeFavoriteCity(weather.name)" class="btn-remove-fav" title="Remover dos favoritos">×</button>
                </div>
              }
            </div>

            <!-- Card de Visualização (Resultado da Busca) -->
            <div class="weather-card preview-card" *ngIf="searchWeatherData">
              <div class="preview-badge">Visualização</div>
              <div class="weather-main">
                <span class="weather-temp">{{ searchWeatherData.main.temp | number:'1.0-0' }}°C</span>
                <div class="weather-details">
                  <span class="weather-city">{{ searchWeatherData.name }}</span>
                  <span class="weather-desc">{{ searchWeatherData.weather[0].description }}</span>
                </div>
              </div>
              <div class="weather-icon">{{ getWeatherEmoji(searchWeatherData.weather[0].main) }}</div>
            </div>

            <button *ngIf="searchWeatherData" (click)="addFavoriteCity()" class="btn-add-favorite" title="Adicionar aos favoritos">
              <span>+ Adicionar a tela inicial</span>
            </button>
          </div>
        </div>

        <section class="todo-section">
          <div class="todo-card">
            <div class="todo-header">
              <h3>📝 Meus Afazeres</h3>
              <p>{{ getPendingCount() }} pendentes</p>
            </div>

            <div class="todo-input-group">
              <input 
                type="text" 
                [(ngModel)]="newTodoText" 
                (keyup.enter)="addTodo()"
                placeholder="O que você precisa fazer?"
                class="todo-input"
              >
              <input 
                type="datetime-local" 
                [(ngModel)]="newTodoDueDate" 
                class="todo-date-input"
                title="Data e hora do prazo"
              >
              <button (click)="addTodo()" class="btn-add">Adicionar</button>
            </div>

            <div class="todo-list">
              @for (todo of todos; track todo.id) {
                <div class="todo-item" [class.completed]="todo.completed" [class.overdue]="isOverdue(todo)" [class.editing]="editingTodoId === todo.id">
                  @if (editingTodoId === todo.id) {
                    <!-- Modo de edição -->
                    <div class="todo-edit-mode">
                      <input 
                        type="text" 
                        [(ngModel)]="editingTodoText" 
                        class="edit-input"
                        placeholder="Texto do afazer"
                      >
                      <input 
                        type="datetime-local" 
                        [(ngModel)]="editingTodoDueDate" 
                        class="edit-date-input"
                      >
                      <div class="edit-actions">
                        <button (click)="saveEditTodo(todo)" class="btn-save">💾</button>
                        <button (click)="cancelEdit()" class="btn-cancel">✖️</button>
                      </div>
                    </div>
                  } @else {
                    <!-- Modo normal -->
                    <div class="todo-content" (click)="toggleTodo(todo)">
                      <div class="checkbox">
                        @if (todo.completed) { <span>✓</span> }
                      </div>
                      <div class="todo-info">
                        <span class="todo-text">{{ todo.text }}</span>
                        @if (todo.dueDate) {
                          <span class="todo-due-date" [class.overdue-text]="isOverdue(todo)">
                            📅 {{ formatDueDate(todo.dueDate) }}
                          </span>
                        }
                      </div>
                    </div>
                    <div class="todo-actions">
                      <button (click)="startEditTodo(todo)" class="btn-edit" title="Editar">✏️</button>
                      <button (click)="removeTodo(todo.id!)" class="btn-remove" title="Remover">🗑️</button>
                    </div>
                  }
                </div>
              } @empty {
                <div class="empty-state">
                  <p>Nenhum afazer por aqui. Que tal adicionar um?</p>
                </div>
              }
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
      font-family: 'Inter', sans-serif;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dashboard-container.dark-mode {
      background: linear-gradient(135deg, #1e272e 0%, #0f1416 100%);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .dashboard-header h1 {
      color: #2d3436;
      font-weight: 700;
    }

    .dark-mode .dashboard-header h1 {
      color: #ffffff;
    }

    .btn-dark-mode {
      padding: 0.8rem 1.2rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      color: #2d3436;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .dark-mode .btn-dark-mode {
      background: rgba(0, 0, 0, 0.3);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .btn-logout {
      padding: 0.8rem 1.5rem;
      background: #ff7675;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(255, 118, 117, 0.3);
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 900px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }

    .user-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      padding: 2rem;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .dark-mode .user-card {
      background: rgba(45, 52, 54, 0.8);
      border-color: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .user-avatar {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #a259ff 0%, #7001FD 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.2rem;
      overflow: hidden;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-info p { margin: 0.2rem 0 0; color: #636e72; }
    .dark-mode .user-info p { color: #b2bec3; }

    .btn-edit-profile {
      margin-top: 0.8rem;
      padding: 0.5rem 1rem;
      background: #f1f2f6;
      border: 1px solid #dfe6e9;
      border-radius: 8px;
      color: #2d3436;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
    }

    .btn-edit-profile:hover {
      background: #dfe6e9;
      transform: translateY(-1px);
    }

    .dark-mode .btn-edit-profile {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .dark-mode .btn-edit-profile:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Weather Card Styles */
    .favorite-cities-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .weather-card {
      position: relative;
      background: linear-gradient(135deg, #7001FD 0%, #a259ff 100%);
      padding: 1.2rem 1.5rem;
      border-radius: 20px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 20px rgba(112, 1, 253, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .dark-mode .weather-card {
      background: linear-gradient(135deg, #1e272e 0%, #2d3436 100%);
    }

    .preview-card {
      background: linear-gradient(135deg, #10ac84 0%, #1dd1a1 100%);
      margin-top: 1rem;
      border-style: dashed;
    }

    .preview-badge {
      position: absolute;
      top: -10px;
      left: 15px;
      background: #10ac84;
      color: white;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .weather-main { display: flex; align-items: center; gap: 1rem; }

    .weather-temp {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .weather-city {
      display: block;
      font-weight: 700;
      font-size: 1rem;
    }

    .weather-desc {
      display: block;
      font-size: 0.8rem;
      opacity: 0.9;
      text-transform: capitalize;
    }

    .weather-icon {
      font-size: 2.5rem;
      filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));
    }

    .btn-remove-fav {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.6;
      transition: 0.2s;
    }

    .btn-remove-fav:hover { opacity: 1; transform: scale(1.2); }

    /* Todo Styles */
    .todo-section { width: 100%; }

    .todo-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      padding: 2rem;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .dark-mode .todo-card {
      background: rgba(45, 52, 54, 0.8);
      border-color: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .todo-header h3 { margin: 0; font-size: 1.5rem; }
    .todo-header p { margin: 0; color: #7001FD; font-weight: 600; }

    .todo-input-group {
      display: flex;
      gap: 0.8rem;
      margin-bottom: 2rem;
    }

    .todo-input {
      flex: 1;
      padding: 1rem;
      border-radius: 12px;
      border: 2px solid #dfe6e9;
      background: white;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
    }

    .dark-mode .todo-input {
      background: #353b48;
      border-color: #4b4b4b;
      color: white;
    }

    .todo-date-input {
      padding: 1rem;
      border-radius: 12px;
      border: 2px solid #dfe6e9;
      background: white;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .todo-date-input:focus {
      border-color: #a259ff;
    }

    .dark-mode .todo-date-input {
      background: #353b48;
      border-color: #4b4b4b;
      color: white;
    }

    /* City Search Styles */
    .city-search {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .search-input {
      flex: 1;
      padding: 0.6rem 1rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: #2d3436;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.3s ease;
    }

    .dark-mode .search-input {
      background: rgba(0, 0, 0, 0.2);
      color: white;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .btn-search-city {
      background: #7001FD;
      border: none;
      border-radius: 12px;
      width: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-search-city:hover {
      transform: scale(1.05);
      background: #a259ff;
    }

    .btn-add-favorite {
      width: 100%;
      margin-top: 1rem;
      padding: 0.8rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px dashed rgba(255, 255, 255, 0.4);
      border-radius: 16px;
      color: #2d3436;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .dark-mode .btn-add-favorite {
      color: white;
      border-color: rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .btn-add-favorite:hover {
      background: #00b894;
      color: white;
      border-style: solid;
      border-color: #00b894;
      transform: translateY(-2px);
    }

    /* Todo Styles */.todo-input:focus { border-color: #a259ff; }

    .btn-add {
      padding: 0 1.5rem;
      background: #7001FD;
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(112, 1, 253, 0.3); }

    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
      transition: all 0.3s ease;
      animation: slideIn 0.3s ease-out;
    }

    .dark-mode .todo-item { background: rgba(255, 255, 255, 0.05); }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .todo-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      flex: 1;
    }

    .todo-info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      flex: 1;
    }

    .todo-due-date {
      font-size: 0.75rem;
      color: #636e72;
      font-weight: 500;
    }

    .dark-mode .todo-due-date {
      color: #b2bec3;
    }

    .overdue-text {
      color: #ff7675 !important;
      font-weight: 700;
    }

    .todo-item.overdue {
      border-left: 3px solid #ff7675;
      background: rgba(255, 118, 117, 0.05);
    }

    .checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid #b2bec3;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00b894;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .completed .checkbox { border-color: #00b894; background: #55efc4; color: white; }
    .completed .todo-text { text-decoration: line-through; color: #b2bec3; }

    .btn-remove {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.3;
      transition: all 0.3s ease;
    }

    .btn-remove:hover { opacity: 1; transform: scale(1.1); }

    .todo-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .btn-edit {
      background: none;
      border: none;
      font-size: 1.1rem;
      cursor: pointer;
      opacity: 0.3;
      transition: all 0.3s ease;
    }

    .btn-edit:hover { opacity: 1; transform: scale(1.1); }

    .todo-item.editing {
      background: rgba(160, 89, 255, 0.05);
      border-left: 3px solid #a259ff;
    }

    .todo-edit-mode {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      width: 100%;
      padding: 0.5rem;
    }

    .edit-input {
      flex: 2;
      padding: 0.5rem;
      border-radius: 8px;
      border: 2px solid #dfe6e9;
      font-size: 0.9rem;
      outline: none;
    }

    .edit-input:focus {
      border-color: #a259ff;
    }

    .dark-mode .edit-input {
      background: #353b48;
      border-color: #4b4b4b;
      color: white;
    }

    .edit-date-input {
      flex: 1;
      padding: 0.5rem;
      border-radius: 8px;
      border: 2px solid #dfe6e9;
      font-size: 0.85rem;
      outline: none;
    }

    .edit-date-input:focus {
      border-color: #a259ff;
    }

    .dark-mode .edit-date-input {
      background: #353b48;
      border-color: #4b4b4b;
      color: white;
    }

    .edit-actions {
      display: flex;
      gap: 0.3rem;
    }

    .btn-save, .btn-cancel {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-save:hover { transform: scale(1.2); }
    .btn-cancel:hover { transform: scale(1.2); }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #b2bec3;
    }
  `]
})
export class UserComponent implements OnInit {

  todos: Todo[] = [];
  newTodoText = '';
  searchInput = '';
  searchWeatherData: any;
  favoriteCities: string[] = [];
  favoriteCitiesWeather: any[] = [];
  userName = 'Usuário';
  userPicture: string | null = null;
  newTodoDueDate: string = '';
  editingTodoId: number | null = null;
  editingTodoText: string = '';
  editingTodoDueDate: string = '';
  apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private weatherService: WeatherService,
    private userService: UserService,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (profile: any) => {
        this.userName = profile.name;
        this.userPicture = profile.picture;
        this.todos = profile.todos || [];

        if (profile.favoriteCity) {
          this.favoriteCities = profile.favoriteCity.split('|').filter((c: string) => c !== '');
          this.favoriteCitiesWeather = []; // Limpa antes de carregar
          this.favoriteCities.forEach((city: string) => this.loadFavoriteWeather(city));
        } else {
          this.favoriteCities = ['Sao Paulo'];
          this.loadFavoriteWeather('Sao Paulo');
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar perfil:', err);
        this.loadFavoriteWeather('Sao Paulo');
      }
    });
  }



  addTodo() {
    if (!this.newTodoText.trim()) return;

    const newTodo: Todo = {
      text: this.newTodoText,
      completed: false,
      dueDate: this.newTodoDueDate || undefined
    };

    console.log('Enviando todo:', newTodo);

    this.userService.addTodo(newTodo).subscribe({
      next: (savedTodo: Todo) => {
        console.log('Todo recebido do backend:', savedTodo);
        this.todos.unshift(savedTodo);
        this.newTodoText = '';
        this.newTodoDueDate = '';
      },
      error: (err: any) => console.error('Erro ao adicionar todo:', err)
    });
  }

  formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) {
      return 'Atrasado!';
    } else if (days === 0 && hours < 24) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Amanhã às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
  }

  isOverdue(todo: Todo): boolean {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }

  startEditTodo(todo: Todo) {
    this.editingTodoId = todo.id!;
    this.editingTodoText = todo.text;
    this.editingTodoDueDate = todo.dueDate || '';
  }

  saveEditTodo(todo: Todo) {
    const updatedTodo: Todo = {
      ...todo,
      text: this.editingTodoText,
      dueDate: this.editingTodoDueDate || undefined
    };

    this.userService.updateTodo(updatedTodo).subscribe({
      next: (saved: Todo) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = saved;
        }
        this.cancelEdit();
      },
      error: (err: any) => console.error('Erro ao atualizar todo:', err)
    });
  }

  cancelEdit() {
    this.editingTodoId = null;
    this.editingTodoText = '';
    this.editingTodoDueDate = '';
  }

  toggleTodo(todo: Todo) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.userService.updateTodo(updatedTodo).subscribe({
      next: (res: Todo) => todo.completed = res.completed,
      error: (err: any) => console.error('Erro ao atualizar todo:', err)
    });
  }

  removeTodo(id: number) {
    this.userService.deleteTodo(id).subscribe({
      next: () => this.todos = this.todos.filter((t: Todo) => t.id !== id),
      error: (err: any) => console.error('Erro ao remover todo:', err)
    });
  }

  loadFavoriteWeather(city: string) {
    this.weatherService.getWeather(city).subscribe({
      next: (data: any) => {
        // Evita duplicatas visuais
        if (!this.favoriteCitiesWeather.find((w: any) => w.name === data.name)) {
          this.favoriteCitiesWeather.push(data);
        }
      }
    });
  }

  previewWeather(city: string) {
    if (!city) return;
    this.weatherService.getWeather(city).subscribe({
      next: (data: any) => this.searchWeatherData = data,
      error: (err: any) => {
        console.error('Erro na API de Clima:', err);
        if (err.status === 401) {
          alert('Chave da API de Clima inválida ou ainda não ativada (pode levar até 2h para ativar).');
        } else {
          alert('Cidade não encontrada ou erro na busca.');
        }
      }
    });
  }

  addFavoriteCity() {
    if (this.searchWeatherData && !this.favoriteCities.includes(this.searchWeatherData.name)) {
      this.favoriteCities.push(this.searchWeatherData.name);
      this.updateProfileCities();
      this.loadFavoriteWeather(this.searchWeatherData.name);
      this.searchWeatherData = null;
      this.searchInput = '';
    }
  }

  removeFavoriteCity(cityName: string) {
    this.favoriteCities = this.favoriteCities.filter(c => c !== cityName);
    this.favoriteCitiesWeather = this.favoriteCitiesWeather.filter(w => w.name !== cityName);
    this.updateProfileCities();
  }

  updateProfileCities() {
    const citiesString = this.favoriteCities.join('|');
    this.userService.updateCity(citiesString).subscribe();
  }

  getWeatherEmoji(main: string): string {
    switch (main) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      default: return '🌤️';
    }
  }

  getPendingCount() {
    return this.todos.filter(t => !t.completed).length;
  }

  goToEditProfile() {
    this.router.navigate(['/edit-user']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
