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
    this.title.setTitle('Bioenergética China en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Descubre la Bioenergética China en Ciudad Real. Terapia holística para restablecer el flujo energético y equilibrar el cuerpo y la mente. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Bioenergética China en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Técnicas milenarias de Bioenergética China para armonizar tu bienestar integral en YogaSadhana.' });
  }
}
