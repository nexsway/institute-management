import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class SubtopicsService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addSubtopics($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addSubtopics, httpParams);
  }

  getSubtopics($params: any = []) {
    return this.http.get<any>(common.getSubtopics, {params: $params});
  }

  editSubtopics($params: any) {
    return this.http.put<any>(common.editSubtopics, $params);
  }

  deleteSubtopics($params: any) {
    return this.http.delete<any>(common.deleteSubtopics,  {params: $params});
  }


}