import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { ChaptersService } from '../../services/chapters.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-chapters',
  templateUrl: './manage-chapters.component.html',
  styleUrls: ['./manage-chapters.component.css']
})
export class ManageChaptersComponent implements OnInit {

  chapterData:object;
  tableShow = false;
  addChapterForm: FormGroup;
  submitted = false;
  editChapterForm: FormGroup;
  subjectData;

  constructor(
    private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private chapterService: ChaptersService,
    private shareService: ShareService, 
    private flashService: FlashService
  ) { }

  ngOnInit(): void {

    this.addChapterForm = this.formBuilder.group({
      subjectId: ['', Validators.required],
      chapterName: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.editChapterForm = this.formBuilder.group({
      subjectId: ['', Validators.required],
      chapterName: ['', Validators.required],
      status: ['active', Validators.required],
      id:['', Validators.required]
    });
    this.getChapter();

    //get all categories
    this.subjectService.getSubject()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
          this.subjectData = success.data;
        //   this.editChapterForm.patchValue({
        //     subjectId: success.data[0].category_name
        // });
      }
    });
    
  }

  get fval() {
    return this.addChapterForm.controls;
  }

  get fvalEdit(){
    return this.editChapterForm.controls;
  }

  addChapter() {
    this.submitted = true;
    if (this.addChapterForm.invalid) {
      return;
    }
    const params = {
      subject_id: this.addChapterForm.value.subjectId,
      chapter_name: this.addChapterForm.value.chapterName,
      status: this.addChapterForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.chapterService.addChapters(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addChapterForm.reset();
        this.submitted = false;
        this.tableShow = false;
        this.getChapter();
        setTimeout(() => {
          $('#addChapter').modal('hide');
        }, 4000);
        this.flashService.request({type: 'addChapter', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addChapter', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addChapter', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  getChapter(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.chapterService.getChapters()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.chapterData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  editChapterClick(item){
    this.submitted = false;
    this.editChapterForm.patchValue({
        subjectId: item.subject_id,
        chapterName: item.chapter_name,
        status: item.status,
        id: item.id
    });
    $('#editChapter').modal('show');
  }

  editChapter() {
    this.submitted = true;
    if (this.editChapterForm.invalid) {
      return;
    }
    const params = {
      id: this.editChapterForm.value.id,
      subject_id: this.editChapterForm.value.subjectId,
      status: this.editChapterForm.value.status,
      chapter_name: this.editChapterForm.value.chapterName
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.chapterService.editChapters(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.submitted = false;
        this.tableShow = false;
        this.getChapter();
        setTimeout(() => {
          $('#editChapter').modal('hide');
        }, 4000);
        this.flashService.request({type: 'editChapter', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editChapter', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editChapter', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
  

  deleteChapter(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this chapter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.chapterService.deleteChapters(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getChapter();

            Swal.fire(
              'Deleted!',
              'Chapter deleted successfully.',
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
