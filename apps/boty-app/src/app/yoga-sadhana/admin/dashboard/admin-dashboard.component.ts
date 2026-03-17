import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

interface StatCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
  color: string;
}

interface ClassItem {
  name: string;
  teacher: string;
  day: string;
  time: string;
  enrolled: number;
  capacity: number;
  style: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  stats: StatCard[] = [
    { label: 'Alumnos Activos', value: '47', delta: '+3 este mes', positive: true, icon: 'group', color: '#924a28' },
    { label: 'Clases esta semana', value: '18', delta: '+2 vs anterior', positive: true, icon: 'self_improvement', color: '#4e635a' },
    { label: 'Reservas pendientes', value: '12', delta: '-5 vs ayer', positive: false, icon: 'event_available', color: '#924a28' },
    { label: 'Ingresos mes', value: '2.840 €', delta: '+8.2%', positive: true, icon: 'euro', color: '#4e635a' },
  ];

  upcomingClasses: ClassItem[] = [
    { name: 'Hatha Yoga', teacher: 'Raquel García', day: 'Lun', time: '09:00', enrolled: 12, capacity: 15, style: 'hatha' },
    { name: 'Vinyasa Flow', teacher: 'Raquel García', day: 'Lun', time: '18:30', enrolled: 15, capacity: 15, style: 'vinyasa' },
    { name: 'Yin Yoga', teacher: 'Carlos Ruiz', day: 'Mar', time: '19:00', enrolled: 8, capacity: 12, style: 'yin' },
    { name: 'Yoga Suave', teacher: 'Raquel García', day: 'Mié', time: '10:00', enrolled: 10, capacity: 12, style: 'suave' },
    { name: 'Khatva Yoga', teacher: 'Carlos Ruiz', day: 'Jue', time: '20:00', enrolled: 6, capacity: 10, style: 'khatva' },
  ];

  recentActivity = [
    { text: 'Nueva reserva de Ana López — Hatha Yoga (Viernes)', time: 'Hace 5 min', icon: 'event_available', type: 'booking' },
    { text: 'Registro nuevo alumno: Pedro Moreno', time: 'Hace 1 h', icon: 'person_add', type: 'user' },
    { text: 'Clase Vinyasa Flow cancelada (Miércoles 18:30)', time: 'Hace 2 h', icon: 'event_busy', type: 'cancel' },
    { text: 'Pago recibido: María Sánchez — Bono 10 sesiones', time: 'Ayer 16:00', icon: 'paid', type: 'payment' },
    { text: 'Nuevo comentario en Instagram — 4.9 ⭐', time: 'Ayer 11:30', icon: 'star', type: 'review' },
  ];

  constructor(public auth: AuthService) {}

  getOccupancyClass(enrolled: number, capacity: number): string {
    const pct = enrolled / capacity;
    if (pct >= 1) return 'full';
    if (pct >= 0.75) return 'high';
    return 'normal';
  }
}
