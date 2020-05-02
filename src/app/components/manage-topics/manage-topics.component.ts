import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopicsService } from '../../services/topics.service';
import { ChaptersService } from '../../services/chapters.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-topics',
  templateUrl: './manage-topics.component.html',
  styleUrls: ['./manage-topics.component.css']
})
export class ManageTopicsComponent implements OnInit {

  topicsData:object;
  tableShow = false;
  addTopicForm: FormGroup;
  submitted = false;
  editTopicForm: FormGroup;
  chapterData;

  constructor(
    private formBuilder: FormBuilder,
    private topicService: TopicsService,
    private chapterService: ChaptersService,
    private shareService: ShareService, 
    private flashService: FlashService
  ) { }

  ngOnInit(): void {

    this.addTopicForm = this.formBuilder.group({
      chapterId: ['', Validators.required],
      topicName: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.editTopicForm = this.formBuilder.group({
      chapterId: ['', Validators.required],
      topicName: ['', Validators.required],
      status: ['active', Validators.required],
      id:['', Validators.required]
    });
    this.getTopics();

    //get all categories
    this.chapterService.getChapters()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
          this.chapterData = success.data;
        //   this.editTopicForm.patchValue({
        //     chapterId: success.data[0].category_name
        // });
      }
    });
    
  }

  get fval() {
    return this.addTopicForm.controls;
  }

  get fvalEdit(){
    return this.editTopicForm.controls;
  }

  addTopic() {
    this.submitted = true;
    if (this.addTopicForm.invalid) {
      return;
    }
    const params = {
      chapter_id: this.addTopicForm.value.chapterId,
      topic_name: this.addTopicForm.value.topicName,
      status: this.addTopicForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.topicService.addTopics(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addTopicForm.reset();
        this.submitted = false;
        this.tableShow = false;
        this.getTopics();
        setTimeout(() => {
          $('#addTopic').modal('hide');
        }, 4000);
        this.flashService.request({type: 'addTopic', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addTopic', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addTopic', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  getTopics(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.topicService.getTopics()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.topicsData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  editTopicClick(item){
    this.submitted = false;
    this.editTopicForm.patchValue({
        chapterId: item.chapter_id,
        topicName: item.topic_name,
        status: item.status,
        id: item.id
    });
    $('#editTopic').modal('show');
  }

  editTopic() {
    this.submitted = true;
    if (this.editTopicForm.invalid) {
      return;
    }
    const params = {
      id: this.editTopicForm.value.id,
      chapter_id: this.editTopicForm.value.chapterId,
      status: this.editTopicForm.value.status,
      topic_name: this.editTopicForm.value.topicName
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.topicService.editTopics(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.submitted = false;
        this.tableShow = false;
        this.getTopics();
        setTimeout(() => {
          $('#editTopic').modal('hide');
        }, 4000);
        this.flashService.request({type: 'editTopic', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editTopic', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editTopic', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
  

  deleteTopic(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this topic!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.topicService.deleteTopics(params)
        .pipe(
          finalize(() => {
            this.shareService.changeMessage({ type: 'loader', status: false });
          })
        )
        .subscribe((data:any) => {
          if(data.status){

            this.tableShow = false;
            this.getTopics();

            Swal.fire(
              'Deleted!',
              'Topic deleted successfully.',
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
