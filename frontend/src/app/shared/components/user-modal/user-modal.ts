import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.html',
  styles: ``,
})
export class UserModal implements OnChanges {
  @Input() isOpen = false;
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<User>();

  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ){
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['regular']
    });
  }

  ngOnChanges(): void {
    if (this.user) {
      this.form.patchValue({
        fullName: this.user.fullName,
        email: this.user.email,
        password: '',
        role: this.user.role,
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.reset({ role: 'regular' });
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
    this.error.set(null)
  }

  get isEditing(): boolean {
    return !!this.user;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const data = this.form.value;

    if (this.isEditing && !data.password) {
      delete data.password;
    }

    const request$ = this.user
      ? this.userService.updateUser(this.user.id, data as UpdateUserRequest)
      : this.userService.createUser(data as CreateUserRequest)

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
    this.form.reset({ role: 'regular' });
    this.close.emit();
  }
}
