import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const ICONS: Record<string, string> = {
  group: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  self_improvement: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  event_available: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`,
  euro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>`,
  trending_up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon-small"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  trending_down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon-small"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`,
  calendar_today: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  arrow_forward: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon-small"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  timeline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  person_add: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>`,
  event_busy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="10" x2="14" y1="14" y2="18"/><line x1="14" x2="10" y1="14" y2="18"/></svg>`,
  paid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="adm-svg-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
};

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
  sanitizer = inject(DomSanitizer);

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

  getIcon(name: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[name] || '');
  }

  getOccupancyClass(enrolled: number, capacity: number): string {
    const pct = enrolled / capacity;
    if (pct >= 1) return 'full';
    if (pct >= 0.75) return 'high';
    return 'normal';
  }
}
