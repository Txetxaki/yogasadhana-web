import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-yin', standalone: true, imports: [RouterModule], templateUrl: './yoga-yin.component.html', styleUrl: './yoga-yin.component.css' })
export class YogaYinComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Yin Yoga en Ciudad Real | Yoga Relajante | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Yin Yoga en Ciudad Real. Posturas pasivas mantenidas 3-5 minutos. Meridianos, fascias y tejidos profundos. Mindfulness y aromaterapia. Primera clase gratis en YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Yin Yoga en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Yoga relajante y meditativo. Meridianos, fascias y técnicas de Medicina China. Primera clase gratis.' });
  }
}
