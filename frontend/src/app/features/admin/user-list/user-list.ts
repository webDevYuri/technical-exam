import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Header } from '../../../shared/components/header/header';
import { UserModal } from '../../../shared/components/user-modal/user-modal';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [DatePipe, Header, UserModal],
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);
  isModalOpen = signal(false);
  selectedUser = signal<User | null>(null);

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);

    this.userService.getUsers({ limit: 100 }).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.selectedUser.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(user: User): void {
    this.selectedUser.set(user);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedUser.set(null);
  }

  onUserSaved(): void {
    this.loadUsers();
  }

  deleteUser(user: User): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
    });
  }
}
