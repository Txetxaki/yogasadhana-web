import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  agents = [
    { icon: '🎯', name: 'Boty', role: 'Director', status: 'ACTIVE', color: '#00e6b4', tasks: 12 },
    { icon: '🏗️', name: 'Arquitecto', role: 'Structure', status: 'ACTIVE', color: '#00b4d8', tasks: 8 },
    { icon: '🎨', name: 'Designer', role: 'UI/3D', status: 'IDLE', color: '#7c3aed', tasks: 5 },
    { icon: '🖥️', name: 'Frontend', role: 'Angular 21', status: 'ACTIVE', color: '#f59e0b', tasks: 15 },
    { icon: '⚙️', name: 'Backend', role: 'APIs', status: 'IDLE', color: '#ef4444', tasks: 9 },
    { icon: '🔍', name: 'Revisor', role: 'QA', status: 'IDLE', color: '#34d399', tasks: 6 },
    { icon: '📚', name: 'Investigador', role: 'Research', status: 'ACTIVE', color: '#a78bfa', tasks: 4 },
  ];

  stats = [
    { label: 'Active Agents', value: '4/7', icon: '●', color: '#00e6b4' },
    { label: 'Neural RAM', value: '12.8', unit: 'GB', icon: '⬡', color: '#00b4d8' },
    { label: 'API Latency', value: '14', unit: 'ms', icon: '⚡', color: '#00e6b4' },
    { label: 'Tasks / Min', value: '842', icon: '📊', color: '#7c3aed' },
  ];

  activities = [
    { agent: 'Designer', action: 'YogaSadhana web completada', time: '1m', status: 'success' },
    { agent: 'Arquitecto', action: 'Estructura Nx definida', time: '5m', status: 'success' },
    { agent: 'Frontend', action: 'Componentes Angular integrados', time: '8m', status: 'success' },
    { agent: 'Investigador', action: 'Research NotebookLM completado', time: '12m', status: 'success' },
    { agent: 'Revisor', action: 'QA Pipeline ejecutado', time: '15m', status: 'success' },
  ];
}
