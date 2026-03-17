import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Booking {
  id?: string;
  className: string;
  teacher: string;
  date: string;
  time: string;
  style: string;
  status?: 'confirmada' | 'completada' | 'cancelada';
  spots?: number;
}

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent {
  viewMode: 'list' | 'create' = 'list';

  bookings: Booking[] = [
    { id: 'b1', className: 'Hatha Yoga', teacher: 'Raquel García', date: '17 Mar 2026', time: '09:00', style: 'hatha', status: 'confirmada' },
    { id: 'b2', className: 'Vinyasa Flow', teacher: 'Raquel García', date: '17 Mar 2026', time: '18:30', style: 'vinyasa', status: 'confirmada' },
    { id: 'b3', className: 'Yin Yoga', teacher: 'Carlos Ruiz', date: '14 Mar 2026', time: '19:00', style: 'yin', status: 'completada' },
    { id: 'b4', className: 'Yoga Suave', teacher: 'Raquel García', date: '12 Mar 2026', time: '10:00', style: 'suave', status: 'completada' },
    { id: 'b5', className: 'Hatha Yoga', teacher: 'Raquel García', date: '10 Mar 2026', time: '09:00', style: 'hatha', status: 'completada' },
    { id: 'b6', className: 'Vinyasa Flow', teacher: 'Raquel García', date: '07 Mar 2026', time: '18:30', style: 'vinyasa', status: 'cancelada' },
    { id: 'b7', className: 'Khatva Yoga', teacher: 'Carlos Ruiz', date: '05 Mar 2026', time: '20:00', style: 'khatva', status: 'completada' },
  ];

  availableClasses: Booking[] = [
    { className: 'Hatha Yoga', teacher: 'Raquel García', date: 'Jueves, 19 Mar 2026', time: '09:00 - 10:15', style: 'hatha', spots: 5 },
    { className: 'Yin Yoga', teacher: 'Carlos Ruiz', date: 'Jueves, 19 Mar 2026', time: '19:00 - 20:15', style: 'yin', spots: 2 },
    { className: 'Vinyasa Flow', teacher: 'Raquel García', date: 'Viernes, 20 Mar 2026', time: '18:30 - 19:45', style: 'vinyasa', spots: 0 },
    { className: 'Yoga Suave', teacher: 'Raquel García', date: 'Sábado, 21 Mar 2026', time: '10:00 - 11:15', style: 'suave', spots: 8 },
    { className: 'Khatva Yoga', teacher: 'Carlos Ruiz', date: 'Lunes, 23 Mar 2026', time: '20:00 - 21:15', style: 'khatva', spots: 15 },
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

  openCreateForm() {
    this.viewMode = 'create';
  }

  closeCreateForm() {
    this.viewMode = 'list';
  }

  bookClass(cls: Booking) {
    if (cls.spots && cls.spots > 0) {
      const newBooking: Booking = {
        id: 'b' + Math.random().toString(36).substring(2, 9),
        className: cls.className,
        teacher: cls.teacher,
        date: cls.date.split(', ')[1] || cls.date, // extract short date
        time: cls.time.split(' - ')[0], // extract start time
        style: cls.style,
        status: 'confirmada'
      };
      
      // Añadir la nueva reserva al principio
      this.bookings.unshift(newBooking);
      this.activeFilter = 'confirmada'; // Saltar directamente a la pestaña de confirmadas
      this.viewMode = 'list'; // Volver al listado
    }
  }

  cancelBooking(id: string) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      const idx = this.bookings.findIndex(b => b.id === id);
      if (idx > -1) {
        this.bookings[idx].status = 'cancelada';
      }
    }
  }
}
