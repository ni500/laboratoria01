import { AuthService } from './../core/auth.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registeredUser$: Observable<boolean>;
  loading: boolean;
  constructor(private formBuilder: FormBuilder, private auth: AuthService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    this.registeredUser$ = this.loginForm.valueChanges.pipe(
      tap(() => (this.loading = true)),
      debounceTime(2000),
      switchMap(form => {
        if (this.loginForm.valid) {
          return this.auth.lookUpUser(form.email);
        } else {
          return of(false);
        }
      }),
      tap(() => (this.loading = false))
    );
  }

  login() {
    this.auth.loginemail(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }

  register() {
    this.auth.emailSignUp(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }
}
