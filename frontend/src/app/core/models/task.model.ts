import { User } from "./user.model";

export interface Task {
    id: number;
    userId: number;
    title: string;
    description: string | null;
    status: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string | null;
    user?: Pick<User, 'id' | 'fullName' | 'email'>;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: 'pending' | 'completed';
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'pending' | 'completed';
}