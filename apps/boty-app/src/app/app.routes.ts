import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
  },
  {
    path: 'yoga-sadhana',
    loadComponent: () => import('./yoga-sadhana/layout/yoga-layout.component').then(m => m.YogaLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./yoga-sadhana/home/yoga-home.component').then(m => m.YogaHomeComponent) },
      { path: 'clases', loadComponent: () => import('./yoga-sadhana/classes/yoga-classes.component').then(m => m.YogaClassesComponent) },
      { path: 'horarios', loadComponent: () => import('./yoga-sadhana/schedule/yoga-schedule.component').then(m => m.YogaScheduleComponent) },
      { path: 'nosotros', loadComponent: () => import('./yoga-sadhana/about/yoga-about.component').then(m => m.YogaAboutComponent) },
      { path: 'hatha-yoga', loadComponent: () => import('./yoga-sadhana/hatha/yoga-hatha.component').then(m => m.YogaHathaComponent) },
      { path: 'vinyasa-yoga', loadComponent: () => import('./yoga-sadhana/vinyasa/yoga-vinyasa.component').then(m => m.YogaVinyasaComponent) },
      { path: 'yin-yoga', loadComponent: () => import('./yoga-sadhana/yin/yoga-yin.component').then(m => m.YogaYinComponent) },
      { path: 'yoga-suave', loadComponent: () => import('./yoga-sadhana/suave/yoga-suave.component').then(m => m.YogaSuaveComponent) },
      { path: 'khatva-yoga', loadComponent: () => import('./yoga-sadhana/khatva/yoga-khatva.component').then(m => m.YogaKhatvaComponent) },
      { path: 'osteopatia', loadComponent: () => import('./yoga-sadhana/osteopatia/yoga-osteopatia.component').then(m => m.YogaOsteopatiaComponent) },
      { path: 'formacion', loadComponent: () => import('./yoga-sadhana/formation/yoga-formation.component').then(m => m.YogaFormationComponent) },
      { path: 'contacto', loadComponent: () => import('./yoga-sadhana/contact/yoga-contact.component').then(m => m.YogaContactComponent) },
    ],
  },
];
