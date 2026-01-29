import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../models/task.model";
import { ApiResponse, PaginatedResponse } from "../models/api-response.model";

@Injectable({
    providedIn: 'root',
})

export class TaskService {
    constructor(private http: HttpClient) {}

    getTasks(params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Observable<PaginatedResponse<Task>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page);
        if (params?.limit) httpParams = httpParams.set('limit', params.limit);
        if (params?.status) httpParams = httpParams.set('status', params.status);

        return this.http.get<PaginatedResponse<Task>>(`${environment.apiUrl}/tasks`, {
            params: httpParams,
        });
    }

    createTask(data: CreateTaskRequest): Observable<ApiResponse<Task>> {
        return this.http.post<ApiResponse<Task>>(`${environment.apiUrl}/tasks`, data);
    }

    updateTask(id: number, data: UpdateTaskRequest): Observable<ApiResponse<Task>> {
        return this.http.put<ApiResponse<Task>>(`${environment.apiUrl}/tasks/${id}`, data);
    }

    deleteTask(id: number): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${environment.apiUrl}/tasks/${id}`);
    }

    getAllTask(params?: {
        page?: number;
        limit?: number;
        status?: string;
        userId?: number;
    }): Observable<PaginatedResponse<Task>> {
        let httpParams = new HttpParams();
        if (params?.page) httpParams = httpParams.set('page', params.page);
        if (params?.limit) httpParams = httpParams.set('limit', params.limit);
        if (params?.status) httpParams = httpParams.set('status', params.status);
        if (params?.userId) httpParams = httpParams.set('userId', params.userId);

        return this.http.get<PaginatedResponse<Task>>(`${environment.apiUrl}/admin/tasks`, {
            params: httpParams,
        });
    }
}