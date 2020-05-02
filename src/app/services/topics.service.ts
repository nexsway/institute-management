import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addTopics($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addTopics, httpParams);
  }

  getTopics($params: any = []) {
    return this.http.get<any>(common.getTopics, {params: $params});
  }

  editTopics($params: any) {
    return this.http.put<any>(common.editTopics, $params);
  }

  deleteTopics($params: any) {
    return this.http.delete<any>(common.deleteTopics,  {params: $params});
  }


}