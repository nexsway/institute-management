import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  addUserForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private shareService: ShareService,
    private flashService: FlashService
    ) { }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      status: ['active', Validators.required]
     });
  }

  get fval() {
    return this.addUserForm.controls;
  }

  addUser() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    const params = {
      full_name: this.addUserForm.value.fullName,
      email: this.addUserForm.value.email,
      phone: this.addUserForm.value.phone,
      password: this.addUserForm.value.password,
      status: this.addUserForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.userManagementService.addUser(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addUserForm.reset();
        this.submitted = false;
        this.flashService.request({type: 'addUser', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addUser', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addUser', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
}