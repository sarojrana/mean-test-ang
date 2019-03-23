import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:8000/';
  constructor(
    private http: HttpClient
  ) { }

  /**
   * login
   * @param loginDetail
   */
  login(loginDetail){
    return this.http.post<any>(this.apiUrl + 'login', loginDetail);
  }

  /**
   * logout current user
   */
  logout(){
    return this.http.post(this.apiUrl + 'logout', { }, { headers: { token: this.getToken() }});
  }

  private getToken() {
    return localStorage.getItem('token');
  }
}
