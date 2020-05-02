import { Component, OnInit } from '@angular/core';
import { ShareService } from './services/share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  loaderStatus = false;

  constructor(
    private shareService: ShareService
  ) { }

  ngOnInit() {
    this.shareService.currentMessage
      .subscribe((data: any) => {
        if (data.type == 'loader') {
          this.loaderStatus = data.status;
        }
      });
  }

}