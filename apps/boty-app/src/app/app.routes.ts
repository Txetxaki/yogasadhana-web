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
      { path: 'bienestar/masajes', loadComponent: () => import('./yoga-sadhana/bienestar/masajes/yoga-masajes.component').then(m => m.YogaMasajesComponent) },
      { path: 'bienestar/osteomasaje', loadComponent: () => import('./yoga-sadhana/bienestar/osteomasaje/yoga-osteomasaje.component').then(m => m.YogaOsteomasajeComponent) },
      { path: 'bienestar/bioenergetica', loadComponent: () => import('./yoga-sadhana/bienestar/bioenergetica/yoga-bioenergetica.component').then(m => m.YogaBioenergeticaComponent) },

      { path: 'formacion', loadComponent: () => import('./yoga-sadhana/formation/yoga-formation.component').then(m => m.YogaFormationComponent) },
      { path: 'contacto', loadComponent: () => import('./yoga-sadhana/contact/yoga-contact.component').then(m => m.YogaContactComponent) },
      // Auth routes
      {
        path: 'login',
        canActivate: [() => import('./yoga-sadhana/auth/auth.guard').then(m => m.guestGuard)],
        loadComponent: () => import('./yoga-sadhana/auth/login/yoga-login.component').then(m => m.YogaLoginComponent),
      },
      {
        path: 'register',
        canActivate: [() => import('./yoga-sadhana/auth/auth.guard').then(m => m.guestGuard)],
        loadComponent: () => import('./yoga-sadhana/auth/register/yoga-register.component').then(m => m.YogaRegisterComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./yoga-sadhana/auth/forgot-password/yoga-forgot-password.component').then(m => m.YogaForgotPasswordComponent),
      },
    ],
  },
  // Admin login — outside yoga-layout, no guard
  {
    path: 'yoga-sadhana/admin/login',
    loadComponent: () => import('./yoga-sadhana/auth/admin-login/yoga-admin-login.component').then(m => m.YogaAdminLoginComponent),
  },
  // Admin area — outside yoga-layout (has its own sidebar layout)
  {
    path: 'yoga-sadhana/admin',
    loadComponent: () => import('./yoga-sadhana/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [() => import('./yoga-sadhana/auth/auth.guard').then(m => m.adminGuard)],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./yoga-sadhana/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('./yoga-sadhana/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'horario', loadComponent: () => import('./yoga-sadhana/admin/schedule/admin-schedule.component').then(m => m.AdminScheduleComponent) },
    ],
  },
  // User dashboard area — outside yoga-layout (has its own sidebar layout)
  {
    path: 'yoga-sadhana/dashboard',
    loadComponent: () => import('./yoga-sadhana/user/layout/user-layout.component').then(m => m.UserLayoutComponent),
    canActivate: [() => import('./yoga-sadhana/auth/auth.guard').then(m => m.authGuard)],
    children: [
      { path: '', loadComponent: () => import('./yoga-sadhana/user/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent) },
      { path: 'reservas', loadComponent: () => import('./yoga-sadhana/user/bookings/user-bookings.component').then(m => m.UserBookingsComponent) },
      { path: 'perfil', loadComponent: () => import('./yoga-sadhana/user/profile/user-profile.component').then(m => m.UserProfileComponent) },
    ],
  },
];
