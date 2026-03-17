import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-yoga-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './yoga-home.component.html',
  styleUrl: './yoga-home.component.css'
})
export class YogaHomeComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('YogaSadhana · Centro de Yoga en Ciudad Real | Hatha, Vinyasa, Yin, Aéreo');
    this.meta.updateTag({ name: 'description', content: 'Centro de yoga en Ciudad Real con más de 6 disciplinas: Hatha Yoga, Vinyasa Flow, Yin Yoga, Khatva Yoga (aéreo), masaje tailandés y osteopatía. Primera clase gratis. Grupos reducidos.' });
    this.meta.updateTag({ property: 'og:title', content: 'YogaSadhana · Centro de Yoga en Ciudad Real' });
    this.meta.updateTag({ property: 'og:description', content: 'Tu santuario de yoga en Ciudad Real. Hatha, Vinyasa, Yin, Khatva, masajes y osteopatía. Primera clase gratis.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
  }

  disciplines = [
    { name: 'Hatha Yoga', desc: 'Equilibrio entre Sol y Luna. Asana, pranayama, meditación y relajación con conceptos de osteopatía y ayurveda integrados.', icon: 'self_improvement', route: '/yoga-sadhana/hatha-yoga', image: 'images/yoga/hatha.png' },
    { name: 'Vinyasa Flow', desc: 'Movimiento fluido sincronizado con la respiración. Una danza meditativa que desarrolla fuerza, flexibilidad y presencia plena.', icon: 'air', route: '/yoga-sadhana/vinyasa-yoga', image: 'images/yoga/vinyasa.png' },
    { name: 'Yin Yoga', desc: 'Posturas pasivas mantenidas 3-5 minutos. Meridianos, fascias y tejidos profundos con mindfulness y aromaterapia.', icon: 'dark_mode', route: '/yoga-sadhana/yin-yoga', image: 'images/yoga/yin.png' },
    { name: 'Yoga Suave', desc: 'Hatha adaptado y relajante con abundantes soportes. Para principiantes, mayores, embarazadas y rehabilitación.', icon: 'spa', route: '/yoga-sadhana/yoga-suave', image: 'images/yoga/suave.png' },
    { name: 'Khatva Yoga', desc: 'Método exclusivo YogaSadhana con telas de suspensión. Descompresión vertebral y relajación profunda.', icon: 'nest_clock_farsight_analog', route: '/yoga-sadhana/khatva-yoga', image: 'images/yoga/khatva.png' },
    { name: 'Osteopatía y Masajes', desc: 'Masaje tailandés, ayurvédico con aceite templado y osteopatía. Sesiones personalizadas para renovación total.', icon: 'healing', route: '/yoga-sadhana/osteopatia', image: 'images/yoga/osteopatia.png' },
  ];
  testimonials = [
    { name: 'Laura M.', text: 'YogaSadhana cambió mi vida. Las clases de Hatha me ayudaron con mi dolor de espalda crónico.', years: '3 años practicando' },
    { name: 'Carlos R.', text: 'El Vinyasa Flow es adictivo. Montse y Pablo son profesores increíbles.', years: '2 años practicando' },
    { name: 'Ana P.', text: 'El Khatva Yoga es una experiencia única. Nunca pensé que podría sentirme tan relajada.', years: '1 año practicando' },
    { name: 'Miguel S.', text: 'El Yin Yoga me enseñó a parar. Es lo mejor que he hecho por mi salud mental.', years: '4 años practicando' },
  ];
  features = [
    { num: '01', title: 'Grupos Reducidos', desc: 'Máximo 10 alumnos por clase para una atención verdaderamente personalizada.' },
    { num: '02', title: 'Profesores Certificados', desc: 'Formación internacional con más de 40 años de experiencia combinada.' },
    { num: '03', title: 'Primera Clase Gratis', desc: 'Prueba sin compromiso y encuentra la disciplina que resuena contigo.' },
  ];
}
