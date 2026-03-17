import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-suave', standalone: true, imports: [RouterModule], templateUrl: './yoga-suave.component.html', styleUrl: './yoga-suave.component.css' })
export class YogaSuaveComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Yoga Suave en Ciudad Real | Yoga para Mayores y Embarazadas | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Yoga Suave en Ciudad Real. Adaptado para principiantes, adultos mayores, embarazadas y rehabilitación. Ritmo pausado con abundantes soportes. Primera clase gratis.' });
    this.meta.updateTag({ property: 'og:title', content: 'Yoga Suave en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Yoga adaptado y amable para todos los cuerpos. Ideal para mayores, embarazadas y recuperación de lesiones.' });
  }
}
