export interface User {
    id: number;
    fullName: string | null;
    email: string;
    role: 'admin' | 'regular';
    createdAt?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message: string;
}

export interface CreateUserRequest {
    fullName?: string | null;
    email: string;
    password: string
    role: 'admin' | 'regular';
}

export interface UpdateUserRequest {
    fullName?: string | null;
    email?: string;
    password?: string
    role?: 'admin' | 'regular';
}