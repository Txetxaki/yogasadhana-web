import { Component } from '@angular/core';

interface ScheduleSlot {
  name: string;
  teacher: string;
  style: string;
  time: string;
  capacity: number;
  enrolled: number;
}

type WeekDay = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [],
  templateUrl: './admin-schedule.component.html',
  styleUrl: './admin-schedule.component.css',
})
export class AdminScheduleComponent {
  weekDays: WeekDay[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  schedule: Record<WeekDay, ScheduleSlot[]> = {
    'Lunes': [
      { name: 'Hatha Yoga', teacher: 'Raquel G.', style: 'hatha', time: '09:00', capacity: 15, enrolled: 12 },
      { name: 'Vinyasa Flow', teacher: 'Raquel G.', style: 'vinyasa', time: '18:30', capacity: 15, enrolled: 15 },
    ],
    'Martes': [
      { name: 'Yoga Suave', teacher: 'Raquel G.', style: 'suave', time: '10:00', capacity: 12, enrolled: 10 },
      { name: 'Yin Yoga', teacher: 'Carlos R.', style: 'yin', time: '19:00', capacity: 12, enrolled: 8 },
    ],
    'Miércoles': [
      { name: 'Hatha Yoga', teacher: 'Raquel G.', style: 'hatha', time: '09:30', capacity: 15, enrolled: 9 },
      { name: 'Khatva Yoga', teacher: 'Carlos R.', style: 'khatva', time: '19:30', capacity: 10, enrolled: 6 },
    ],
    'Jueves': [
      { name: 'Vinyasa Flow', teacher: 'Raquel G.', style: 'vinyasa', time: '10:00', capacity: 15, enrolled: 11 },
      { name: 'Khatva Yoga', teacher: 'Carlos R.', style: 'khatva', time: '20:00', capacity: 10, enrolled: 7 },
    ],
    'Viernes': [
      { name: 'Hatha Yoga', teacher: 'Raquel G.', style: 'hatha', time: '09:00', capacity: 15, enrolled: 13 },
      { name: 'Yin Yoga', teacher: 'Carlos R.', style: 'yin', time: '18:00', capacity: 12, enrolled: 12 },
    ],
    'Sábado': [
      { name: 'Yoga Suave', teacher: 'Raquel G.', style: 'suave', time: '10:00', capacity: 15, enrolled: 8 },
      { name: 'Osteopatía', teacher: 'Dr. Marcos', style: 'osteo', time: '11:30', capacity: 6, enrolled: 4 },
    ],
  };

  getOccupancyPct(enrolled: number, capacity: number): number {
    return Math.round((enrolled / capacity) * 100);
  }
}
