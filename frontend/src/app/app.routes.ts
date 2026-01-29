import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login').then((m) => m.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'tasks',
        loadComponent: () =>
            import('./features/tasks/task-list/task-list').then((m) => m.TaskList),
        canActivate: [authGuard]
    },
    {
        path: 'admin/users',
        loadComponent: () =>
            import('./features/admin/user-list/user-list').then((m) => m.UserList),
        canActivate: [authGuard, adminGuard]
    }
];
