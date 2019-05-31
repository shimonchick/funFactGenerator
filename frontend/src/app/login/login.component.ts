import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hide = true;

  addressForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService) {}

  onSubmit() {
    const username = this.addressForm.get('username').value;
    const password = this.addressForm.get('password').value;
    this.authService.login(username, password);
    // alert('Thanks!');
  }
}
