import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-schedule', standalone: true, imports: [RouterModule], templateUrl: './yoga-schedule.component.html', styleUrl: './yoga-schedule.component.css' })
export class YogaScheduleComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Horarios de Yoga en Ciudad Real 2026 | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Horario semanal de clases de yoga en Ciudad Real. Hatha, Vinyasa, Yin, Suave y Khatva. Mañana y tarde, lunes a viernes. Grupos reducidos en YogaSadhana.' });
  }
  routeMap: Record<string, string> = {
    'Hatha Yoga': '/yoga-sadhana/hatha-yoga',
    'Vinyasa Flow': '/yoga-sadhana/vinyasa-yoga',
    'Yin Yoga': '/yoga-sadhana/yin-yoga',
    'Yoga Suave': '/yoga-sadhana/yoga-suave',
    'Khatva Yoga': '/yoga-sadhana/khatva-yoga',
  };
  schedule = [
    { time: '10:00 - 11:15', mon: 'Vinyasa Flow', tue: 'Yoga Suave', wed: 'Vinyasa Flow', thu: 'Yoga Suave', fri: 'Khatva Yoga' },
    { time: '11:30 - 12:30', mon: '—', tue: '—', wed: '—', thu: '—', fri: 'Khatva Yoga' },
    { time: '18:00 - 19:15', mon: 'Hatha Yoga', tue: 'Hatha Yoga', wed: 'Hatha Yoga', thu: 'Hatha Yoga', fri: 'Hatha Yoga' },
    { time: '19:00 - 20:15', mon: '—', tue: 'Yin Yoga', wed: '—', thu: 'Yin Yoga', fri: '—' },
    { time: '19:30 - 20:30', mon: 'Hatha Yoga', tue: '—', wed: 'Hatha Yoga', thu: '—', fri: '—' },
  ];
}
