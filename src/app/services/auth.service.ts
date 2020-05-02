import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }


  login($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.login, httpParams);
  }

  setToken(token, currentUser) {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  getToken() {
    if (!!localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }




  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

}