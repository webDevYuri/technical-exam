import { Component, EventEmitter, Input, input, OnChanges, Output, signal, Signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styles: ``,
})
export class TaskModal implements OnChanges {
  @Input() isOpen = false;
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Task>();

  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ){
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      status: ['pending']
    });
  }

  ngOnChanges(): void {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status,
      });
    } else {
      this.form.reset({ status: 'pending' });
    }
    this.error.set(null)
  } 

  get isEditing(): boolean {
    return !!this.task;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const data = this.form.value;
    const request$ = this.task
      ? this.taskService.updateTask(this.task.id, data as UpdateTaskRequest)
      : this.taskService.createTask(data as CreateTaskRequest)

    request$.subscribe({
      next: (response) => {
        this.loading.set(false);
        this.saved.emit(response.data);
        this.onClose();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'An error occured')
      },
    });
  }

  onClose(): void {
    this.form.reset({ status: 'pending' });
    this.close.emit();
  }
}
