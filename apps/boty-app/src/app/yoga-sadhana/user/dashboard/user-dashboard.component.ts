import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { AddressManager } from './address-manager';
import { StudentOrders } from './student-orders';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, AddressManager, StudentOrders],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  activeTab = signal<'overview' | 'addresses' | 'orders'>('overview');

  upcomingClasses = [
    { name: 'Hatha Yoga', day: 'Lunes', date: '17 Mar', time: '09:00', teacher: 'Raquel García', style: 'hatha', confirmed: true },
    { name: 'Vinyasa Flow', day: 'Lunes', date: '17 Mar', time: '18:30', teacher: 'Raquel García', style: 'vinyasa', confirmed: true },
    { name: 'Yin Yoga', day: 'Martes', date: '18 Mar', time: '19:00', teacher: 'Carlos Ruiz', style: 'yin', confirmed: false },
  ];

  quickLinks = [
    { label: 'Ver Horario', route: '/yoga-sadhana/horarios', icon: 'calendar', color: '#924a28' },
    { label: 'Mis Reservas', route: '/yoga-sadhana/dashboard/reservas', icon: 'event', color: '#4e635a' },
    { label: 'Mi Perfil', route: '/yoga-sadhana/dashboard/perfil', icon: 'profile', color: '#924a28' },
    { label: 'Formación', route: '/yoga-sadhana/formacion', icon: 'school', color: '#4e635a' },
  ];

  streakWeeks = 6;
  totalClasses = 42;
  nextClass = 'Hoy a las 09:00';

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'orders') {
        this.activeTab.set('orders');
      } else if (params['tab'] === 'addresses') {
        this.activeTab.set('addresses');
      }
    });
  }
}
