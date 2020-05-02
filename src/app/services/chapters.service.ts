import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class ChaptersService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addChapters($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addChapters, httpParams);
  }

  getChapters($params: any = []) {
    return this.http.get<any>(common.getChapters, {params: $params});
  }

  editChapters($params: any) {
    return this.http.put<any>(common.editChapters, $params);
  }

  deleteChapters($params: any) {
    return this.http.delete<any>(common.deleteChapters,  {params: $params});
  }


}