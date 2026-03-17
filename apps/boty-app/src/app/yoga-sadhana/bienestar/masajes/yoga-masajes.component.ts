import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-yoga-masajes',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './yoga-masajes.component.html',
  styleUrl: './yoga-masajes.component.css'
})
export class YogaMasajesComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Masajes Terapéuticos en Ciudad Real | Relajante, Ayurvédico, Tailandés · YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Masajes profesionales en Ciudad Real: masaje relajante, ayurvédico Abhyanga con aceites templados, masaje tailandés y masaje en pareja. Más de 20 años de experiencia en bienestar integral. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Masajes Terapéuticos en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Masaje relajante, Abhyanga ayurvédico, tailandés y en pareja. Sesiones personalizadas de bienestar en YogaSadhana Ciudad Real.' });
  }
}
