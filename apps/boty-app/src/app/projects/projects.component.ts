import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Yoga Sadhana',
      subtitle: 'Centro de Yoga · Ciudad Real',
      description: 'Web completa con estética zen, 3D sutil, SEO optimizado y diseño responsive premium.',
      route: '/yoga-sadhana',
      gradient: 'linear-gradient(135deg, #7c6a4f, #a89279)',
      tags: ['Angular', '3D', 'SEO', 'Responsive'],
      status: 'Live',
      emoji: '🧘',
    },
  ];
}
