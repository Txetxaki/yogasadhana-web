import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-yoga-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './yoga-forgot-password.component.html',
  styleUrl: './yoga-forgot-password.component.css',
})
export class YogaForgotPasswordComponent {
  email = '';
  loading = signal(false);
  sent = signal(false);
  error = signal('');

  onSubmit(): void {
    if (!this.email) {
      this.error.set('Por favor introduce tu email.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    setTimeout(() => {
      this.loading.set(false);
      this.sent.set(true);
    }, 800);
  }
}
