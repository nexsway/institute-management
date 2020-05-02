import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-exam',
  templateUrl: './manage-exam.component.html',
  styleUrls: ['./manage-exam.component.css']
})
export class ManageExamComponent implements OnInit {

  examData:object;
  tableShow = false;

  constructor(
    private examService: ExamService,
    private shareService: ShareService
  ) { }

  ngOnInit(): void {

    this.getExam();
    
  }

  getExam(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.examService.getExam()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.examData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  deleteExam(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this exam!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.examService.deleteExam(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getExam();

            Swal.fire(
              'Deleted!',
              'Exam deleted successfully.',
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