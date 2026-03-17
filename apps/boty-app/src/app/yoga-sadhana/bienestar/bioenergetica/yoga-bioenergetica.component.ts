import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-yoga-bioenergetica',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './yoga-bioenergetica.component.html',
  styleUrl: './yoga-bioenergetica.component.css'
})
export class YogaBioenergeticaComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Bioenergética China y Bioenergética Facial en Ciudad Real · YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Bioenergética China en Ciudad Real: moxibustión, ventosas, estimulación de puntos energéticos basada en Medicina Tradicional China. Bioenergética Facial para luminosidad y equilibrio natural. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Bioenergética China · Reequilibrio Energético YogaSadhana Ciudad Real' });
    this.meta.updateTag({ property: 'og:description', content: 'Sesiones de bioenergética china y facial. Moxibustión, cupping, estimulación de meridianos. Bienestar energético profundo en Ciudad Real.' });
  }
}
