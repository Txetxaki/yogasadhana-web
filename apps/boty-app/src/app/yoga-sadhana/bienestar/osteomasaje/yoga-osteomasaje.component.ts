import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-yoga-osteomasaje',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './yoga-osteomasaje.component.html',
  styleUrl: './yoga-osteomasaje.component.css'
})
export class YogaOsteomasajeComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Osteomasaje y Liberación Miofascial en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Osteomasaje y Liberación Miofascial Integral en Ciudad Real. Sistema tradicional con gran poder preventivo y de reequilibrio. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Osteomasaje y Liberación Miofascial · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Terapias de osteomasaje y liberación miofascial para la relajación profunda y el reequilibrio físico en Ciudad Real.' });
  }
}
