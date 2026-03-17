import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-hatha', standalone: true, imports: [RouterModule], templateUrl: './yoga-hatha.component.html', styleUrl: './yoga-hatha.component.css' })
export class YogaHathaComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Clases de Hatha Yoga en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Clases de Hatha Yoga en Ciudad Real. La rama más clásica del yoga: asana, pranayama, meditación y relajación. Todos los niveles. Grupos reducidos. Primera clase gratis.' });
    this.meta.updateTag({ property: 'og:title', content: 'Hatha Yoga en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Equilibrio entre Sol y Luna. Clases de Hatha Yoga con conceptos de osteopatía y ayurveda. Primera clase gratis.' });
  }
}
