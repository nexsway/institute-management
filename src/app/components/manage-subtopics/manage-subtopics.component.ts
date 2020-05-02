import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopicsService } from '../../services/topics.service';
import { SubtopicsService } from '../../services/subtopics.service';
import { ShareService } from '../../services/share.service';
import { finalize } from 'rxjs/operators';
import { FlashService } from 'flash-text';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-manage-subtopics',
  templateUrl: './manage-subtopics.component.html',
  styleUrls: ['./manage-subtopics.component.css']
})
export class ManageSubtopicsComponent implements OnInit {

  subtopicsData:object;
  tableShow = false;
  addSubtopicForm: FormGroup;
  submitted = false;
  editSubtopicForm: FormGroup;
  topicData;

  constructor(
    private formBuilder: FormBuilder,
    private topicService: TopicsService,
    private subtopicService: SubtopicsService,
    private shareService: ShareService, 
    private flashService: FlashService
  ) { }

  ngOnInit(): void {

    this.addSubtopicForm = this.formBuilder.group({
      topicId: ['', Validators.required],
      subtopicName: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.editSubtopicForm = this.formBuilder.group({
      topicId: ['', Validators.required],
      subtopicName: ['', Validators.required],
      status: ['active', Validators.required],
      id:['', Validators.required]
    });
    this.getTopics();

    //get all categories
    this.topicService.getTopics()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
          this.topicData = success.data;
        //   this.editSubtopicForm.patchValue({
        //     topicId: success.data[0].category_name
        // });
      }
    });
    
  }

  get fval() {
    return this.addSubtopicForm.controls;
  }

  get fvalEdit(){
    return this.editSubtopicForm.controls;
  }

  addSubtopic() {
    this.submitted = true;
    if (this.addSubtopicForm.invalid) {
      return;
    }
    const params = {
      topic_id: this.addSubtopicForm.value.topicId,
      subtopic_name: this.addSubtopicForm.value.subtopicName,
      status: this.addSubtopicForm.value.status
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.subtopicService.addSubtopics(params)
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((success) => {
      if (success.status) {
        this.addSubtopicForm.reset();
        this.submitted = false;
        this.tableShow = false;
        this.getTopics();
        setTimeout(() => {
          $('#addSubtopic').modal('hide');
        }, 4000);
        this.flashService.request({type: 'addSubtopic', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'addSubtopic', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'addSubtopic', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }

  getTopics(){
    //this.shareService.changeMessage({ type: 'loader', status: true });
    this.subtopicService.getSubtopics()
    .pipe(
      finalize(() => {
        this.shareService.changeMessage({ type: 'loader', status: false });
      })
    )
    .subscribe((data:any) => {
      this.subtopicsData = data.data;
      this.tableShow = true;
      $(document).ready(function () {
        (<any>$('#example')).DataTable();
      })
      
    });
  }

  editSubtopicClick(item){
    this.submitted = false;
    this.editSubtopicForm.patchValue({
        topicId: item.topic_id,
        subtopicName: item.subtopic_name,
        status: item.status,
        id: item.id
    });
    $('#editSubtopic').modal('show');
  }

  editSubtopic() {
    this.submitted = true;
    if (this.editSubtopicForm.invalid) {
      return;
    }
    const params = {
      id: this.editSubtopicForm.value.id,
      topic_id: this.editSubtopicForm.value.topicId,
      status: this.editSubtopicForm.value.status,
      subtopic_name: this.editSubtopicForm.value.subtopicName
    }
    this.shareService.changeMessage({type: 'loader',status: true});
    this.subtopicService.editSubtopics(params)
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
          $('#editSubtopic').modal('hide');
        }, 4000);
        this.flashService.request({type: 'editSubtopic', message: success.message, class: 'flash-success'});
      } else {
        this.flashService.request({type: 'editSubtopic', message: success.message, class: 'flash-danger'});
      }
    }, (error) => {
      this.flashService.request({type: 'editSubtopic', message: 'Unable to proccess your request', class: 'flash-danger'});
    });
  }
  

  deleteSubtopic(id){
    const params = {
      id: id
    } 
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this subtopic!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subtopicService.deleteSubtopics(params)
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
              'Subtopic deleted successfully.',
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
