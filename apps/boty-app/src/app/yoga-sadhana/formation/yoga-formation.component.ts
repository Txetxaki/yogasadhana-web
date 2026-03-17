import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-formation', standalone: true, imports: [RouterModule], templateUrl: './yoga-formation.component.html', styleUrl: './yoga-formation.component.css' })
export class YogaFormationComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Formación de Profesores de Yoga en Ciudad Real | RYT 200 & 500 | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Formación de profesores de yoga certificada por Yoga Alliance en Ciudad Real. RYT 200, RYT 500 y formación continua. Convierta su pasión en profesión con YogaSadhana.' });
  }
}
