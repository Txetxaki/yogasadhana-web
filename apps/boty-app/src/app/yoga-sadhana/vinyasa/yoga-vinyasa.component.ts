import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-vinyasa', standalone: true, imports: [RouterModule], templateUrl: './yoga-vinyasa.component.html', styleUrl: './yoga-vinyasa.component.css' })
export class YogaVinyasaComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Clases de Vinyasa Flow en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Vinyasa Flow en Ciudad Real. Yoga dinámico, fluido y creativo. Coordinación de movimiento y respiración. Fuerza, cardio y meditación en movimiento. Primera clase gratis.' });
    this.meta.updateTag({ property: 'og:title', content: 'Vinyasa Flow en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Movimiento fluido sincronizado con la respiración. Clases de Vinyasa Flow para todos los niveles.' });
  }
}
