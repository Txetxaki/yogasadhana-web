import { Component } from '@angular/core';

interface Booking {
  id: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  style: string;
  status: 'confirmada' | 'completada' | 'cancelada';
}

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent {
  bookings: Booking[] = [
    { id: 'b1', className: 'Hatha Yoga', teacher: 'Raquel García', date: '17 Mar 2026', time: '09:00', style: 'hatha', status: 'confirmada' },
    { id: 'b2', className: 'Vinyasa Flow', teacher: 'Raquel García', date: '17 Mar 2026', time: '18:30', style: 'vinyasa', status: 'confirmada' },
    { id: 'b3', className: 'Yin Yoga', teacher: 'Carlos Ruiz', date: '14 Mar 2026', time: '19:00', style: 'yin', status: 'completada' },
    { id: 'b4', className: 'Yoga Suave', teacher: 'Raquel García', date: '12 Mar 2026', time: '10:00', style: 'suave', status: 'completada' },
    { id: 'b5', className: 'Hatha Yoga', teacher: 'Raquel García', date: '10 Mar 2026', time: '09:00', style: 'hatha', status: 'completada' },
    { id: 'b6', className: 'Vinyasa Flow', teacher: 'Raquel García', date: '07 Mar 2026', time: '18:30', style: 'vinyasa', status: 'cancelada' },
    { id: 'b7', className: 'Khatva Yoga', teacher: 'Carlos Ruiz', date: '05 Mar 2026', time: '20:00', style: 'khatva', status: 'completada' },
  ];

  activeFilter: 'todas' | 'confirmada' | 'completada' | 'cancelada' = 'todas';

  filters = [
    { label: 'Todas', value: 'todas' as const },
    { label: 'Próximas', value: 'confirmada' as const },
    { label: 'Completadas', value: 'completada' as const },
    { label: 'Canceladas', value: 'cancelada' as const },
  ];

  get filtered(): Booking[] {
    if (this.activeFilter === 'todas') return this.bookings;
    return this.bookings.filter(b => b.status === this.activeFilter);
  }

  setFilter(f: 'todas' | 'confirmada' | 'completada' | 'cancelada'): void {
    this.activeFilter = f;
  }
}
