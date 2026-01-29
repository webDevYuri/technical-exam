import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/components/header/header';
import { TaskModal } from '../../../shared/components/task-modal/task-modal';
import { Task } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, FormsModule, Header, TaskModal],
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);
  users = signal<User[]>([]);
  loading = signal(false);
  isModalOpen = signal(false);
  selectedTask = signal<Task | null>(null);

  statusFilter = '';
  userFilter = '';

  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    if (this.authService.isAdmin()) {
      this.loadUsers();
    }
  }

  loadTasks(): void {
    this.loading.set(true);

    const params: { status?: string; userId?: number } = {};
    if (this.statusFilter) params.status = this.statusFilter;

    const request$ =
      this.authService.isAdmin() && !this.userFilter
        ? this.taskService.getAllTask({ ...params, limit: 100 })
        : this.authService.isAdmin() && this.userFilter
          ? this.taskService.getAllTask({ ...params, userId: +this.userFilter, limit: 100 })
          : this.taskService.getTasks({ ...params, limit: 100 });

    request$.subscribe({
      next: (response) => {
        this.tasks.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadUsers(): void {
    this.userService.getUsers({ limit: 100 }).subscribe({
      next: (response) => {
        this.users.set(response.data);
      },
    });
  }

  onFilterChange(): void {
    this.loadTasks();
  }

  openCreateModal(): void {
    this.selectedTask.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.selectedTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedTask.set(null);
  }

  onTaskSaved(): void {
    this.loadTasks();
  }

  toggleStatus(task: Task): void {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTasks();
      },
    });
  }

  deleteTask(task: Task): void {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.loadTasks();
      },
    });
  }
}
