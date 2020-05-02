import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addExam($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addExam, httpParams);
  }

  getExam($params: any = []) {
    return this.http.get<any>(common.getExam, {params: $params});
  }

  editExam($params: any) {
    return this.http.put<any>(common.editExam, $params);
  }

  deleteExam($params: any) {
    return this.http.delete<any>(common.deleteExam,  {params: $params});
  }


}