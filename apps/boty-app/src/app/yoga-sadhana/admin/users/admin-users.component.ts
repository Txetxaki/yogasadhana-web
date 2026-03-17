import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  initials: string;
  email: string;
  joinDate: string;
  favoriteStyle: string;
  classesAttended: number;
  status: 'activa' | 'inactiva' | 'bono';
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {
  searchTerm = '';

  students: Student[] = [
    { id: 'u1', name: 'Laura Martínez', initials: 'LM', email: 'alumna@yogasadhana.xyz', joinDate: '2024-09-10', favoriteStyle: 'Vinyasa Flow', classesAttended: 42, status: 'activa' },
    { id: 'u2', name: 'María Sánchez', initials: 'MS', email: 'maria@yogasadhana.xyz', joinDate: '2025-01-20', favoriteStyle: 'Yin Yoga', classesAttended: 15, status: 'bono' },
    { id: 'u3', name: 'Ana López', initials: 'AL', email: 'ana@gmail.com', joinDate: '2024-11-05', favoriteStyle: 'Hatha Yoga', classesAttended: 28, status: 'activa' },
    { id: 'u4', name: 'Carmen Torres', initials: 'CT', email: 'carmen@gmail.com', joinDate: '2025-02-14', favoriteStyle: 'Yoga Suave', classesAttended: 8, status: 'activa' },
    { id: 'u5', name: 'Pedro Moreno', initials: 'PM', email: 'pedro@hotmail.com', joinDate: '2025-03-01', favoriteStyle: 'Hatha Yoga', classesAttended: 3, status: 'activa' },
    { id: 'u6', name: 'Rosa Díaz', initials: 'RD', email: 'rosa@gmail.com', joinDate: '2024-06-20', favoriteStyle: 'Khatva Yoga', classesAttended: 65, status: 'bono' },
    { id: 'u7', name: 'Isabel García', initials: 'IG', email: 'isabel@outlook.es', joinDate: '2024-03-15', favoriteStyle: 'Vinyasa Flow', classesAttended: 2, status: 'inactiva' },
  ];

  get filtered(): Student[] {
    if (!this.searchTerm.trim()) return this.students;
    const q = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.favoriteStyle.toLowerCase().includes(q)
    );
  }
}
