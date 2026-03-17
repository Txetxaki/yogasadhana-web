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
    this.title.setTitle('Osteomasaje y Liberación Miofascial en Ciudad Real · YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Osteomasaje y liberación miofascial integral en Ciudad Real. Técnica manual que trabaja los sistemas estructural, visceral y sacrocraneal para restaurar la movilidad natural y el equilibrio corporal. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Osteomasaje y Liberación Miofascial · YogaSadhana Ciudad Real' });
    this.meta.updateTag({ property: 'og:description', content: 'Terapia manual integral: osteomasaje, liberación miofascial y trabajo sacrocraneal. Sesiones personalizadas desde 50€ en YogaSadhana Ciudad Real.' });
  }
}
