import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-yoga-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './yoga-layout.component.html',
  styleUrl: './yoga-layout.component.css',
})
export class YogaLayoutComponent {
  menuOpen = false;
  userMenuOpen = false;

  subLinks = [
    { label: 'Hatha Yoga', route: '/yoga-sadhana/hatha-yoga', icon: 'self_improvement' },
    { label: 'Vinyasa Flow', route: '/yoga-sadhana/vinyasa-yoga', icon: 'air' },
    { label: 'Yin Yoga', route: '/yoga-sadhana/yin-yoga', icon: 'dark_mode' },
    { label: 'Yoga Suave', route: '/yoga-sadhana/yoga-suave', icon: 'spa' },
    { label: 'Khatva Yoga', route: '/yoga-sadhana/khatva-yoga', icon: 'nest_clock_farsight_analog' },
    { label: 'Osteopatía', route: '/yoga-sadhana/osteopatia', icon: 'healing' },
  ];

  constructor(public auth: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeMenus() {
    this.menuOpen = false;
    this.userMenuOpen = false;
  }

  logout() {
    this.userMenuOpen = false;
    this.auth.logout();
  }

  get dashboardRoute(): string {
    return this.auth.isAdmin() ? '/yoga-sadhana/admin/dashboard' : '/yoga-sadhana/dashboard';
  }
}
