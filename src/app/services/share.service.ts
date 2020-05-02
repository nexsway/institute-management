import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private messageSource = new Subject();
  currentMessage = this.messageSource.asObservable();

  constructor(
    private authService: AuthService
  ) { }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }




}