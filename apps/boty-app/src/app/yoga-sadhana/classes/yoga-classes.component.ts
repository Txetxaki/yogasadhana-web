import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-classes', standalone: true, imports: [RouterModule], templateUrl: './yoga-classes.component.html', styleUrl: './yoga-classes.component.css' })
export class YogaClassesComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Clases de Yoga en Ciudad Real | Precios y Horarios | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Todas las clases de yoga en Ciudad Real de YogaSadhana: Hatha, Vinyasa, Yin, Suave, Khatva y Osteopatía. Grupos reducidos, profesores certificados. Primera clase gratis.' });
  }
  disciplines = [
    { name: 'Hatha Yoga', desc: 'La rama más clásica del yoga. Asana, pranayama, meditación y relajación con conceptos de osteopatía y ayurveda.', route: '/yoga-sadhana/hatha-yoga', icon: 'self_improvement', schedule: 'Lun a Vie · 18:00-19:15', level: 'Todos los niveles', image: 'images/yoga/hatha.png' },
    { name: 'Vinyasa Flow', desc: 'Estilo fluido y dinámico. Coordinación de movimiento y respiración consciente para fuerza, flexibilidad y cardio.', route: '/yoga-sadhana/vinyasa-yoga', icon: 'air', schedule: 'Lun & Mié · 10:00-11:15', level: 'Intermedio', image: 'images/yoga/vinyasa.png' },
    { name: 'Yin Yoga', desc: 'Posturas pasivas mantenidas 3-5 minutos. Estimulación de meridianos y tejidos conectivos profundos.', route: '/yoga-sadhana/yin-yoga', icon: 'dark_mode', schedule: 'Mar & Jue · 19:00-20:15', level: 'Todos los niveles', image: 'images/yoga/yin.png' },
    { name: 'Yoga Suave', desc: 'Adaptado, relajante y amable. Para principiantes, adultos mayores, embarazadas y recuperación.', route: '/yoga-sadhana/yoga-suave', icon: 'spa', schedule: 'Mar & Jue · 10:00-11:00', level: 'Principiante', image: 'images/yoga/suave.png' },
    { name: 'Khatva Yoga', desc: 'Método exclusivo con telas de suspensión. Descompresión vertebral, inversiones seguras y relajación profunda.', route: '/yoga-sadhana/khatva-yoga', icon: 'nest_clock_farsight_analog', schedule: 'Vie · 11:00-12:15', level: 'Intermedio', image: 'images/yoga/khatva.png' },
    { name: 'Osteopatía y Masajes', desc: 'Masaje tailandés, ayurvédico con aceite templado y osteopatía. Sesiones personalizadas.', route: '/yoga-sadhana/osteopatia', icon: 'healing', schedule: 'Con cita previa', level: 'Individual', image: 'images/yoga/osteopatia.png' },
  ];
}
