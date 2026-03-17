import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-yoga-admin-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './yoga-admin-login.component.html',
  styleUrl: './yoga-admin-login.component.css',
})
export class YogaAdminLoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    setTimeout(() => {
      const result = this.auth.login(this.email, this.password);
      this.loading.set(false);
      if (!result.success) {
        this.error.set(result.error || 'Credenciales inválidas.');
        return;
      }
      if (!this.auth.isAdmin()) {
        this.auth.logout();
        this.error.set('No tienes permisos de administrador.');
        return;
      }
      this.router.navigate(['/yoga-sadhana/admin/dashboard']);
    }, 600);
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}
