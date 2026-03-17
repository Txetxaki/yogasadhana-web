import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
@Component({ selector: 'app-yoga-osteopatia', standalone: true, imports: [RouterModule], templateUrl: './yoga-osteopatia.component.html', styleUrl: './yoga-osteopatia.component.css' })
export class YogaOsteopatiaComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Masaje Tailandés y Osteopatía en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Masaje tailandés, masaje ayurvédico y osteopatía en Ciudad Real. Terapias manuales personalizadas para alivio del dolor, relajación profunda y renovación integral. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Osteopatía y Masajes en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Masaje tailandés, ayurvédico con aceite y osteopatía. Sesiones personalizadas en YogaSadhana Ciudad Real.' });
  }
}
