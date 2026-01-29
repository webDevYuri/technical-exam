import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { User, LoginRequest, LoginResponse } from "../models/user.model";
import { ApiResponse } from "../models/api-response.model";

const TOKEN_KEY = 'auth_token';
const USER_KEY = "auth_user";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUser = signal<User | null>(this.getStoredUser());

    user = this.currentUser.asReadonly();
    isAuthenticated = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'admin')

    constructor(
        private http: HttpClient,
        private router: Router
    ){}

    login(credential: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credential).pipe(
            tap((response) => {
                if (response.success) {
                    this.setToken(response.data.token);
                    this.setUser(response.data.user);
                }
            })
        );
    }

    logout(): Observable<ApiResponse<null>> {
        return this.http.post<ApiResponse<null>>(`${environment.apiUrl}/auth/logout`, {}).pipe(
            tap(() => {
                this.clearAuth();
                this.router.navigate(['/login']);
            })
        );
    }

    me(): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/me`).pipe(
            tap((response) => {
                if (response.success) {
                    this.setUser(response.data);
                }
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    clearAuth(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.currentUser.set(null);
    }

    private setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    private setUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
    }

    private getStoredUser(): User | null {
        const userJson = localStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }
}