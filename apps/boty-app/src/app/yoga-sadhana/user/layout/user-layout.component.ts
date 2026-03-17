import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  navItems = [
    { label: 'Mi Área', route: '/yoga-sadhana/dashboard', icon: 'dashboard', exact: true },
    { label: 'Mis Reservas', route: '/yoga-sadhana/dashboard/reservas', icon: 'event_available', exact: false },
    { label: 'Mi Perfil', route: '/yoga-sadhana/dashboard/perfil', icon: 'manage_accounts', exact: false },
  ];

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (this.isMobile()) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.sidebarCollapsed = true;
    }
  }

  isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  logout(): void {
    this.auth.logout();
  }
}
