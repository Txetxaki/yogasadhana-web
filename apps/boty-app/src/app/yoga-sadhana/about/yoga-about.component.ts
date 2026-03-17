import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-about', standalone: true, imports: [RouterModule], templateUrl: './yoga-about.component.html', styleUrl: './yoga-about.component.css' })
export class YogaAboutComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Sobre Nosotros | Equipo de Profesores de Yoga | YogaSadhana Ciudad Real');
    this.meta.updateTag({ name: 'description', content: 'Conoce al equipo de YogaSadhana: Montse, Pablo y Paola. Más de 40 años de experiencia combinada, formación internacional en India y Tailandia. Tu centro de yoga en Ciudad Real.' });
  }
}
