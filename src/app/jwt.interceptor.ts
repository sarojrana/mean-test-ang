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
    if(token){
      request = request.clone({
        setHeaders: { token: token }
      });
    }
    return next.handle(request).pipe(tap(response => {
    }, err => {
      if(err instanceof HttpErrorResponse){
        if(err.status == 401){
          this.router.navigate(['/login']);
        }
      }
    }));
  }

}
