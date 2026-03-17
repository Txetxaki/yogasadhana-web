import { Component, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  editMode = signal(false);
  saved = signal(false);

  yogaStyles = ['Hatha Yoga', 'Vinyasa Flow', 'Yin Yoga', 'Yoga Suave', 'Khatva Yoga', 'Osteopatía'];

  constructor(public auth: AuthService, private router: Router) {}

  get user() { return this.auth.currentUser(); }

  toggleEdit(): void { this.editMode.set(!this.editMode()); }

  saveChanges(): void {
    this.editMode.set(false);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  logout(): void { this.auth.logout(); }
}
