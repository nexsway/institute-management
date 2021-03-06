import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addUser($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addUser, httpParams);
  }

  getUser($params: any = []) {
    return this.http.get<any>(common.getUser, {params: $params});
  }

  editUser($params: any) {
    return this.http.put<any>(common.editUser, $params);
  }

  deleteUser($params: any) {
    return this.http.delete<any>(common.deleteUser,  {params: $params});
  }


}