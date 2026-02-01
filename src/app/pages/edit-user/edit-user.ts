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
  pictureUrl: string | null = null;


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
        this.pictureUrl = profile.picture ? profile.picture : null;
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.userService.uploadPicture(file).subscribe({
        next: (url: string) => {
          this.pictureUrl = url;
          alert('Foto atualizada com sucesso!');
        },
        error: (err: any) => {
          console.error('Erro no upload:', err);
          alert('Erro ao enviar foto. Verifique o tamanho ou formato.');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/user']);
  }
}
