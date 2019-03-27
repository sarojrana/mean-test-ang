import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = `${config.serverApiUrl}users`;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * get user list
   * @param queryParams
   */
  getUserList(queryParams: any = {}){
    return this.http.get<any>(this.apiUrl, { params: queryParams });
  }

  /**
   * get user detail
   * @param id
   */
  getUserDetail(id){
    return this.http.get<any>(this.apiUrl + '/' + id);
  }

  /**
   * create user
   * @param userData
   */
  createUser(userData){
    return this.http.post<any>(this.apiUrl, userData);
  }

  /**
   * edit user
   * @param id
   * @param userData
   */
  editUser(id, userData){
    return this.http.put<any>(this.apiUrl + '/' + id, userData);
  }

  /**
   * delete user
   * @param id
   */
  deleteUser(id){
    return this.http.delete<any>(this.apiUrl + '/' + id);
  }
}
