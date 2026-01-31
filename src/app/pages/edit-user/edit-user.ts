import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss',
})
export class EditUser implements OnInit {
  name = '';
  email = '';
  isLoading = true;


  constructor(
    private userService: UserService,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    console.log('EditUser iniciou, buscando perfil...');
    this.userService.getUserProfile().subscribe({
      next: (profile: any) => {
        console.log('Perfil recebido:', profile);
        this.name = profile.name;
        this.email = profile.email;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro detalhado ao carregar perfil:', err);
        // Não redireciona imediatamente para podermos ver o erro no console
        this.isLoading = false;
        alert('Erro ao carregar dados do usuário. Verifique o console.');
      }
    });
  }

  onSubmit() {
    if (!this.name || !this.email) return;

    this.userService.updateProfile(this.name, this.email).subscribe({
      next: () => {
        alert('Perfil atualizado com sucesso!');
        this.router.navigate(['/user']);
      },
      error: (err: any) => {
        console.error('Erro ao atualizar perfil:', err);
        alert('Erro ao atualizar perfil. Tente novamente.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/user']);
  }
}
