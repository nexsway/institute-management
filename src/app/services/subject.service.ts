import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addSubject($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addSubject, httpParams);
  }

  getSubject($params: any = []) {
    return this.http.get<any>(common.getSubject, {params: $params});
  }

  editSubject($params: any) {
    return this.http.put<any>(common.editSubject, $params);
  }

  deleteSubject($params: any) {
    return this.http.delete<any>(common.deleteSubject,  {params: $params});
  }


}