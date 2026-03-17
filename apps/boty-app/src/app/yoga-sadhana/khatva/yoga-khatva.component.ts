import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-khatva', standalone: true, imports: [RouterModule], templateUrl: './yoga-khatva.component.html', styleUrl: './yoga-khatva.component.css' })
export class YogaKhatvaComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Khatva Yoga en Ciudad Real | Yoga Aéreo con Telas | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Khatva Yoga en Ciudad Real. Método exclusivo YogaSadhana con telas de suspensión. Descompresión vertebral, inversiones seguras y relajación profunda. Primera clase gratis.' });
    this.meta.updateTag({ property: 'og:title', content: 'Khatva Yoga · Método Exclusivo YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Yoga aéreo con telas de suspensión. Método exclusivo que solo encontrarás en YogaSadhana Ciudad Real.' });
  }
}
