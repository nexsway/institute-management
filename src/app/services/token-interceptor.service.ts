 import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {
  
  constructor(
    private injector: Injector,
    private router: Router) { }

  intercept(req, next) {
    const authService = this.injector.get(AuthService);
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: authService.getToken()
      }
    });
    return next.handle(tokenizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          alert('unauthorized request, Redirecting to signin.');
          authService.logout();
          this.router.navigate(['./login']);
        }
        return throwError(error);
    }));
  }

}