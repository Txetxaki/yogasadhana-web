import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

const YOGA_STYLES = [
  'Hatha Yoga',
  'Vinyasa Flow',
  'Yin Yoga',
  'Yoga Suave',
  'Khatva Yoga',
  'Osteopatía',
];

@Component({
  selector: 'app-yoga-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './yoga-register.component.html',
  styleUrl: './yoga-register.component.css',
})
export class YogaRegisterComponent {
  name = '';
  email = '';
  password = '';
  favoriteStyle = '';
  yogaStyles = YOGA_STYLES;
  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error.set('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (this.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    setTimeout(() => {
      const result = this.auth.register({
        name: this.name,
        email: this.email,
        password: this.password,
        favoriteStyle: this.favoriteStyle || 'Hatha Yoga',
      });
      this.loading.set(false);
      if (!result.success) {
        this.error.set(result.error || 'Error al crear la cuenta.');
        return;
      }
      this.router.navigate(['/yoga-sadhana/dashboard']);
    }, 600);
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}
