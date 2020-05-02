import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})

export class ManageuserComponent implements OnInit {

  userData:object;
  tableShow = false;

  constructor(
    private userManagementService: UserManagementService,
    private shareService: ShareService
  ) { }

  ngOnInit(): void {

    this.getUser();
    
  }

  getUser(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.userManagementService.getUser()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.userData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  deleteUser(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.userManagementService.deleteUser(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getUser();

            Swal.fire(
              'Deleted!',
              'User deleted successfully.',
              'success'
            );
          }else{
            Swal.fire(
              'Failed!',
              data.message,
              'error'
            );
          }
        });
        
      }
    })
  }

}
