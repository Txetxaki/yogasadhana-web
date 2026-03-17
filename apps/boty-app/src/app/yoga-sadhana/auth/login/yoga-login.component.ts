import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-yoga-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './yoga-login.component.html',
  styleUrl: './yoga-login.component.css',
})
export class YogaLoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  private returnUrl: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')
      ?? '/yoga-sadhana/dashboard/reservas';
  }

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
        this.error.set(result.error || 'Error al iniciar sesión.');
        return;
      }
      if (this.auth.isAdmin()) {
        this.router.navigate(['/yoga-sadhana/admin/dashboard']);
      } else {
        this.router.navigateByUrl(this.returnUrl);
      }
    }, 600);
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}
