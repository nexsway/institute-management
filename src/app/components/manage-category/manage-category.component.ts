import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit {

  categoryData:object;
  tableShow = false;
  addCategoryForm: FormGroup;
  submitted = false;
  editCategoryForm: FormGroup;
  editCategoryId;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private shareService: ShareService,
    private flashService: FlashService
  ) { }

  ngOnInit(): void {

    this.addCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.editCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      status: ['active', Validators.required],
      id:['', Validators.required]
    });
    this.getCategory();
    
  }

  get fval() {
    return this.addCategoryForm.controls;
  }

  get fvalEdit(){
    return this.editCategoryForm.controls;
  }

  addCategory() {
    this.submitted = true;
    if (this.addCategoryForm.invalid) {
      return;
    }
    const params = {
      category_name: this.addCategoryForm.value.categoryName,
      status: this.addCategoryForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.categoryService.addCategory(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addCategoryForm.reset();
        this.submitted = false;
        this.tableShow = false;
        this.getCategory();
        setTimeout(() => {
          $('#addCategory').modal('hide');
        }, 4000);
        this.flashService.request({type: 'addCategory', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addCategory', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addCategory', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  getCategory(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.categoryService.getCategory()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.categoryData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  editCategoryClick(item){
    this.submitted = false;
    this.editCategoryForm.patchValue({
        categoryName: item.category_name,
        status: item.status,
        id: item.id
    });
    $('#editCategory').modal('show');
  }

  editCategory() {
    this.submitted = true;
    if (this.editCategoryForm.invalid) {
      return;
    }
    const params = {
      id: this.editCategoryForm.value.id,
      status: this.editCategoryForm.value.status,
      category_name: this.editCategoryForm.value.categoryName
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.categoryService.editCategory(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.submitted = false;
        this.tableShow = false;
        this.getCategory();
        setTimeout(() => {
          $('#editCategory').modal('hide');
        }, 4000);
        this.flashService.request({type: 'editCategory', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editCategory', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editCategory', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
  

  deleteCategory(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.categoryService.deleteCategory(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getCategory();

            Swal.fire(
              'Deleted!',
              'Category deleted successfully.',
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
