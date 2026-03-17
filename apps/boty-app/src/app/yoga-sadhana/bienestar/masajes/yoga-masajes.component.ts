import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-yoga-masajes',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './yoga-masajes.component.html',
  styleUrl: './yoga-masajes.component.css'
})
export class YogaMasajesComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('Masajes y Terapias en Ciudad Real | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Masajes y terapias en Ciudad Real. Enfoque holístico para el bienestar físico, energético y psicoemocional. YogaSadhana.' });
    this.meta.updateTag({ property: 'og:title', content: 'Masajes y Bienestar en Ciudad Real · YogaSadhana' });
    this.meta.updateTag({ property: 'og:description', content: 'Descubre nuestra amplia gama de técnicas de masaje para lograr un estado de Bienestar Integral en Ciudad Real.' });
  }
}
