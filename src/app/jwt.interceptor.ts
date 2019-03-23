import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders,
  HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'token': token,
    });
    const clonedReq = request.clone({ headers: headers });
    return next.handle(clonedReq).pipe(tap(response => {
    }, err => {
      if(err instanceof HttpErrorResponse){
        if(err.status == 401){
          this.router.navigate(['/login']);
        }
      }
    }));
  }

}
