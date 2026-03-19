import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  navItems = [
    { label: 'Dashboard', route: '/yoga-sadhana/admin/dashboard', icon: 'dashboard' },
    { label: 'Usuarios', route: '/yoga-sadhana/admin/usuarios', icon: 'group' },
    { label: 'Horario', route: '/yoga-sadhana/admin/horario', icon: 'calendar_month' },
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

  private router = inject(Router);

  get isShopRoute(): boolean {
    return this.router.url.includes('/admin/tienda');
  }

  logout(): void {
    this.auth.logout();
  }
}
