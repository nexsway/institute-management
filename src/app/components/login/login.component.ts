import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ShareService } from '../../services/share.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private shareService: ShareService,
    private router: Router,
    private flashService: FlashService
    ) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
     });
  }

  get fval() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const params = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.authService.login(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        const data = success.data;
        const token = data.token;
        delete data.token;
        this.authService.setToken(token, data);
        this.flashService.request({type: 'login', message: success.message, class: 'flash-success'});
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      } else {
        this.flashService.request({type: 'login', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'login', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
}