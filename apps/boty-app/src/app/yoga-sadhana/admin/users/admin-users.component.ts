import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface ClassHistory {
  id: string;
  name: string;
  date: string;
  attended: boolean;
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'admin' | 'user';
  joinDate: string;
  favoriteStyle: string;
  classesAttended: number;
  status: 'activa' | 'inactiva' | 'bono';
  avatarUrl?: string;
  phone?: string;
  history?: ClassHistory[];
}

type ViewMode = 'list' | 'detail' | 'form';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {
  searchTerm = '';
  viewMode: ViewMode = 'list';
  selectedStudent: Student | null = null;
  formStudent: Partial<Student> = {};

  students: Student[] = [
    { id: 'u1', name: 'Laura Martínez', initials: 'LM', email: 'alumna@yogasadhana.xyz', role: 'user', joinDate: '2024-09-10', favoriteStyle: 'Vinyasa Flow', classesAttended: 42, status: 'activa', phone: '+34 600 123 456', history: [{id: 'c1', name: 'Vinyasa Matinal', date: '2025-03-15', attended: true}, {id: 'c2', name: 'Hatha Yoga', date: '2025-03-12', attended: true}] },
    { id: 'u2', name: 'María Sánchez', initials: 'MS', email: 'maria@yogasadhana.xyz', role: 'user', joinDate: '2025-01-20', favoriteStyle: 'Yin Yoga', classesAttended: 15, status: 'bono', phone: '+34 611 222 333', history: [{id: 'c3', name: 'Yin Yoga', date: '2025-03-16', attended: true}] },
    { id: 'u3', name: 'Sergio Gómez', initials: 'SG', email: 'sergiogdiseno@gmail.com', role: 'admin', joinDate: '2024-11-05', favoriteStyle: 'Hatha Yoga', classesAttended: 120, status: 'activa', history: [] },
    { id: 'u4', name: 'Carmen Torres', initials: 'CT', email: 'carmen@gmail.com', role: 'user', joinDate: '2025-02-14', favoriteStyle: 'Yoga Suave', classesAttended: 8, status: 'activa', history: [] },
    { id: 'u5', name: 'Pedro Moreno', initials: 'PM', email: 'pedro@hotmail.com', role: 'user', joinDate: '2025-03-01', favoriteStyle: 'Hatha Yoga', classesAttended: 3, status: 'activa', history: [] },
    { id: 'u6', name: 'Rosa Díaz', initials: 'RD', email: 'rosa@gmail.com', role: 'user', joinDate: '2024-06-20', favoriteStyle: 'Khatva Yoga', classesAttended: 65, status: 'bono', history: [] },
    { id: 'u7', name: 'Isabel García', initials: 'IG', email: 'isabel@outlook.es', role: 'user', joinDate: '2024-03-15', favoriteStyle: 'Vinyasa Flow', classesAttended: 2, status: 'inactiva', history: [] },
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

  // --- Actions ---

  viewDetails(student: Student) {
    this.selectedStudent = { ...student };
    this.viewMode = 'detail';
  }

  closeDetails() {
    this.selectedStudent = null;
    this.viewMode = 'list';
  }

  openCreateForm() {
    this.formStudent = {
      role: 'user',
      status: 'activa',
      classesAttended: 0,
      favoriteStyle: 'Hatha Yoga'
    };
    this.viewMode = 'form';
  }

  openEditForm(student: Student) {
    this.formStudent = { ...student };
    this.viewMode = 'form';
  }

  cancelForm() {
    this.formStudent = {};
    if (this.selectedStudent) {
      this.viewMode = 'detail';
    } else {
      this.viewMode = 'list';
    }
  }

  saveStudent() {
    if (!this.formStudent.name || !this.formStudent.email) {
      alert('Nombre y correo son obligatorios.');
      return;
    }

    // Auto-generate initials if not provided
    if (!this.formStudent.initials) {
      this.formStudent.initials = this.formStudent.name
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    if (!this.formStudent.joinDate) {
      this.formStudent.joinDate = new Date().toISOString().split('T')[0];
    }

    if (this.formStudent.id) {
      // Update existing
      const index = this.students.findIndex(s => s.id === this.formStudent.id);
      if (index > -1) {
        this.students[index] = this.formStudent as Student;
        // Also update selected if editing from detail view
        if (this.selectedStudent && this.selectedStudent.id === this.formStudent.id) {
            this.selectedStudent = {...this.students[index]};
        }
      }
    } else {
      // Create new
      this.formStudent.id = 'u' + Date.now().toString();
      this.students.unshift(this.formStudent as Student);
    }

    // Return to previous view
    if (this.selectedStudent) {
      this.viewMode = 'detail';
    } else {
      this.viewMode = 'list';
    }
    this.formStudent = {};
  }

  deleteStudent(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esa acción no se puede deshacer.')) {
      this.students = this.students.filter(s => s.id !== id);
      if (this.selectedStudent && this.selectedStudent.id === id) {
        this.closeDetails();
      }
    }
  }

  toggleRole(student: Student) {
    const newRole = student.role === 'admin' ? 'user' : 'admin';
    if(confirm(`¿Cambiar rol de ${student.name} a ${newRole.toUpperCase()}?`)) {
       student.role = newRole;
       // Also update the main array
       const index = this.students.findIndex(s => s.id === student.id);
       if (index > -1) {
           this.students[index].role = newRole;
       }
    }
  }

}

