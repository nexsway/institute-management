import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../../services/user-management.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  editUserForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private shareService: ShareService,
    private flashService: FlashService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.shareService.changeMessage({type: 'loader',status: true});
    const routeParams = {
      id: this.route.snapshot.params.id
    }
    this.userManagementService.getUser(routeParams)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        let data = success.data;
       // console.log(data['full_name'])
        this.editUserForm = this.formBuilder.group({
          fullName: [data.full_name, Validators.required],
          email: [data.email, [Validators.required, Validators.email]],
          phone: [data.phone, Validators.required],
          password: [data.password, Validators.required],
          status: [data.status, Validators.required]
         });
      } else {
        this.flashService.request({type: 'editUser', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editUser', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  get fval() {
    return this.editUserForm.controls;
  }

  editUser() {
    this.submitted = true;
    if (this.editUserForm.invalid) {
      return;
    }
    const params = {
      id: this.route.snapshot.params.id,
      full_name: this.editUserForm.value.fullName,
      email: this.editUserForm.value.email,
      phone: this.editUserForm.value.phone,
      password: this.editUserForm.value.password,
      status: this.editUserForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.userManagementService.editUser(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.submitted = false;
        this.flashService.request({type: 'editUser', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editUser', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editUser', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
}