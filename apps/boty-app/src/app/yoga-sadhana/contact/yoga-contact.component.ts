import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-contact', standalone: true, imports: [RouterModule], templateUrl: './yoga-contact.component.html', styleUrl: './yoga-contact.component.css' })
export class YogaContactComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Contacto | Reservar Clase de Yoga en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Reserva tu primera clase de yoga gratis en YogaSadhana Ciudad Real. Contacto por WhatsApp +34 600 582 381. Dirección, horarios y redes sociales.' });
  }
}
