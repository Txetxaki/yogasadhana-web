import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { UserService, UserProfile } from '../../../core/services/user.service';

export interface ClassHistory {
  id: string;
  name: string;
  date: string;
  attended: boolean;
}

// Extendemos UserProfile con history opcional si se requiere
export type Student = UserProfile & { history?: ClassHistory[] };

type ViewMode = 'list' | 'detail' | 'form';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  viewMode: ViewMode = 'list';
  selectedStudent: Student | null = null;
  formStudent: Partial<Student> = {};
  students: Student[] = [];
  isLoading = true;
  debugError = '';

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadUsers();
    }
  }

  async loadUsers() {
    this.isLoading = true;
    this.debugError = '';
    try {
      const users = await this.userService.getAllUsers();
      this.students = users;
      if (users.length === 0) {
        this.debugError = '0 documentos encontrados en Firestore.';
      }
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      this.debugError = 'Error Firebase: ' + (err.message || err.toString());
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  get filtered(): Student[] {
    if (!this.searchTerm.trim()) return this.students;
    const q = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      (s.favoriteStyle && s.favoriteStyle.toLowerCase().includes(q))
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

  async saveStudent() {
    if (!this.formStudent.name || !this.formStudent.email) {
      alert('Nombre y correo son obligatorios.');
      return;
    }

    if (!this.formStudent.joinDate) {
      this.formStudent.joinDate = new Date().toISOString().split('T')[0];
    }

    if (this.formStudent.id) {
      // Update existing
      try {
        await this.userService.updateUser(this.formStudent.id, this.formStudent);
        await this.loadUsers();
        
        if (this.selectedStudent && this.selectedStudent.id === this.formStudent.id) {
            this.selectedStudent = this.students.find(s => s.id === this.selectedStudent!.id) || null;
        }
      } catch (err) {
        console.error('Error al actualizar:', err);
        alert('Hubo un error al guardar.');
      }
    } else {
      // Create new (solo en db, sin auth)
      this.formStudent.id = 'u' + Date.now().toString();
      try {
        await this.userService.createUser(this.formStudent as UserProfile);
        await this.loadUsers();
      } catch (err) {
        console.error('Error al crear:', err);
        alert('Hubo un error al crear.');
      }
    }

    // Return to previous view
    if (this.selectedStudent) {
      this.viewMode = 'detail';
    } else {
      this.viewMode = 'list';
    }
    this.formStudent = {};
  }

  async deleteStudent(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esa acción no se puede deshacer.')) {
      try {
        await this.userService.deleteUser(id);
        await this.loadUsers();
        if (this.selectedStudent && this.selectedStudent.id === id) {
          this.closeDetails();
        }
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Hubo un error al eliminar.');
      }
    }
  }

  async toggleRole(student: Student) {
    const newRole = student.role === 'admin' ? 'user' : 'admin';
    if(confirm(`¿Cambiar rol de ${student.name} a ${newRole.toUpperCase()}?`)) {
       try {
         await this.userService.updateUser(student.id, { role: newRole });
         await this.loadUsers();
         if (this.selectedStudent && this.selectedStudent.id === student.id) {
            this.selectedStudent = this.students.find(s => s.id === this.selectedStudent!.id) || null;
         }
       } catch (err) {
         console.error('Error al cambiar rol:', err);
         alert('Hubo un error al cambiar el rol.');
       }
    }
  }

}

