import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent {
  navItems = [
    { label: 'Mi Área', route: '/yoga-sadhana/dashboard', icon: 'dashboard', exact: true },
    { label: 'Mis Reservas', route: '/yoga-sadhana/dashboard/reservas', icon: 'event_available', exact: false },
    { label: 'Mi Perfil', route: '/yoga-sadhana/dashboard/perfil', icon: 'manage_accounts', exact: false },
  ];

  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
