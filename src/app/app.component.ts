import { User } from './models/user';
import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'laboratoria01';

  user: User;
  constructor(public authService: AuthService) {
    this.authService.user$.subscribe(user => (this.user = user));
  }
}
