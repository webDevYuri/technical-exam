import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './header.html',
  styles: ``,
})
export class Header {
  constructor(public authService: AuthService){  }
    onLogout(): void {
      this.authService.logout().subscribe();
    }
}
