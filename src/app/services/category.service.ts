import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as common from './common';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // tslint:disable-next-line: variable-name
  constructor(
    private http: HttpClient,
    ) { }


  addCategory($params: any) {
    let httpParams = new HttpParams();
    // tslint:disable-next-line: only-arrow-functions
    Object.keys($params).forEach(function (key) {
      httpParams = httpParams.append(key, $params[key]);
    });
    return this.http.post<any>(common.addCategory, httpParams);
  }

  getCategory($params: any = []) {
    return this.http.get<any>(common.getCategory, {params: $params});
  }

  editCategory($params: any) {
    return this.http.put<any>(common.editCategory, $params);
  }

  deleteCategory($params: any) {
    return this.http.delete<any>(common.deleteCategory,  {params: $params});
  }


}