import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addCourses($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addCourses, httpParams);
  }

  getCourses($params: any = []) {
    return this.http.get<any>(common.getCourses, {params: $params});
  }

  editCourses($params: any) {
    return this.http.put<any>(common.editCourses, $params);
  }

  deleteCourses($params: any) {
    return this.http.delete<any>(common.deleteCourses,  {params: $params});
  }


}