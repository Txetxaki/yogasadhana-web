import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;

  navItems = [
    { label: 'Dashboard', route: '/yoga-sadhana/admin/dashboard', icon: 'dashboard' },
    { label: 'Usuarios', route: '/yoga-sadhana/admin/usuarios', icon: 'group' },
    { label: 'Horario', route: '/yoga-sadhana/admin/horario', icon: 'calendar_month' },
  ];

  constructor(public auth: AuthService) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.auth.logout();
  }
}
