import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { CategoryService } from '../../services/category.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-courses',
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.css']
})
export class ManageCoursesComponent implements OnInit {


  coursesData:object;
  tableShow = false;
  addCoursesForm: FormGroup;
  submitted = false;
  editCoursesForm: FormGroup;
  editCoursesId;
  categoryData;

  constructor(
    private formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private categoryService: CategoryService,
    private shareService: ShareService, 
    private flashService: FlashService
  ) { }

  ngOnInit(): void {

    this.addCoursesForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      coursesName: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.editCoursesForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      coursesName: ['', Validators.required],
      status: ['active', Validators.required],
      id:['', Validators.required]
    });
    this.getCourses();

    //get all categories
    this.categoryService.getCategory()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
          this.categoryData = success.data;
        //   this.editCoursesForm.patchValue({
        //     categoryId: success.data[0].category_name
        // });
      }
    });
    
  }

  get fval() {
    return this.addCoursesForm.controls;
  }

  get fvalEdit(){
    return this.editCoursesForm.controls;
  }

  addCourses() {
    this.submitted = true;
    if (this.addCoursesForm.invalid) {
      return;
    }
    const params = {
      category_id: this.addCoursesForm.value.categoryId,
      course_name: this.addCoursesForm.value.coursesName,
      status: this.addCoursesForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.coursesService.addCourses(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addCoursesForm.reset();
        this.submitted = false;
        this.tableShow = false;
        this.getCourses();
        setTimeout(() => {
          $('#addCourses').modal('hide');
        }, 4000);
        this.flashService.request({type: 'addCourses', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addCourses', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addCourses', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  getCourses(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.coursesService.getCourses()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.coursesData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  editCoursesClick(item){
    this.submitted = false;
    this.editCoursesForm.patchValue({
        categoryId: item.category_id,
        coursesName: item.course_name,
        status: item.status,
        id: item.id
    });
    $('#editCourses').modal('show');
  }

  editCourses() {
    this.submitted = true;
    if (this.editCoursesForm.invalid) {
      return;
    }
    const params = {
      id: this.editCoursesForm.value.id,
      category_id: this.editCoursesForm.value.categoryId,
      status: this.editCoursesForm.value.status,
      course_name: this.editCoursesForm.value.coursesName
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.coursesService.editCourses(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.submitted = false;
        this.tableShow = false;
        this.getCourses();
        setTimeout(() => {
          $('#editCourses').modal('hide');
        }, 4000);
        this.flashService.request({type: 'editCourses', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editCourses', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editCourses', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
  

  deleteCourses(id){
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
        this.coursesService.deleteCourses(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getCourses();

            Swal.fire(
              'Deleted!',
              'Course deleted successfully.',
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
