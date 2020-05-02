import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { CoursesService } from '../../services/courses.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-subject',
  templateUrl: './manage-subject.component.html',
  styleUrls: ['./manage-subject.component.css']
})

export class ManageSubjectComponent implements OnInit {

  subjectData:object;
  tableShow = false;
  addSubjectForm: FormGroup;
  submitted = false;
  editSubjectForm: FormGroup;
  courseData;

  constructor(
    private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private courseService: CoursesService,
    private shareService: ShareService, 
    private flashService: FlashService
  ) { }

  ngOnInit(): void {

    this.addSubjectForm = this.formBuilder.group({
      courseId: ['', Validators.required],
      subjectName: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.editSubjectForm = this.formBuilder.group({
      courseId: ['', Validators.required],
      subjectName: ['', Validators.required],
      status: ['active', Validators.required],
      id:['', Validators.required]
    });
    this.getSubject();

    //get all categories
    this.courseService.getCourses()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
          this.courseData = success.data;
        //   this.editSubjectForm.patchValue({
        //     courseId: success.data[0].category_name
        // });
      }
    });
    
  }

  get fval() {
    return this.addSubjectForm.controls;
  }

  get fvalEdit(){
    return this.editSubjectForm.controls;
  }

  addSubject() {
    this.submitted = true;
    if (this.addSubjectForm.invalid) {
      return;
    }
    const params = {
      course_id: this.addSubjectForm.value.courseId,
      subject_name: this.addSubjectForm.value.subjectName,
      status: this.addSubjectForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.subjectService.addSubject(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addSubjectForm.reset();
        this.submitted = false;
        this.tableShow = false;
        this.getSubject();
        setTimeout(() => {
          $('#addSubject').modal('hide');
        }, 4000);
        this.flashService.request({type: 'addSubject', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addSubject', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addSubject', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  getSubject(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.subjectService.getSubject()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.subjectData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  editSubjectClick(item){
    this.submitted = false;
    this.editSubjectForm.patchValue({
        courseId: item.course_id,
        subjectName: item.subject_name,
        status: item.status,
        id: item.id
    });
    $('#editSubject').modal('show');
  }

  editSubject() {
    this.submitted = true;
    if (this.editSubjectForm.invalid) {
      return;
    }
    const params = {
      id: this.editSubjectForm.value.id,
      course_id: this.editSubjectForm.value.courseId,
      status: this.editSubjectForm.value.status,
      subject_name: this.editSubjectForm.value.subjectName
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.subjectService.editSubject(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.submitted = false;
        this.tableShow = false;
        this.getSubject();
        setTimeout(() => {
          $('#editSubject').modal('hide');
        }, 4000);
        this.flashService.request({type: 'editSubject', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editSubject', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editSubject', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
  

  deleteSubject(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subjectService.deleteSubject(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getSubject();

            Swal.fire(
              'Deleted!',
              'Subject deleted successfully.',
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
