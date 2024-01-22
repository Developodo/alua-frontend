import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { LocalSessionService } from './local-session.service';
import { StravaService } from './strava.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

let isRefreshing=false;


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let session = inject(LocalSessionService);
  if(req.url.includes(environment.urlApi)) {
    return next(req);
  }
  // console.log("--------------",req,"--------------");

  
  /*req = req.clone({
    withCredentials: true,
  });*/

  /*
  req = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${session.user?.access_token}` )
  });
  */
  

  return next(req).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('oauth/authorize') &&
        error.status === 401
      ) {
        return handle401Error(req, next as any);
      }

      return throwError(() => error);
    })
  );
};

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  let session = inject(LocalSessionService);
  if (!isRefreshing) {
    isRefreshing = true;
    let strava = inject(StravaService);
    let router = inject(Router);

    if (session.user) {
      return strava.refreshToken().pipe(
        switchMap((e:any) => {
          console.log("OJOOOOOOOO que estamos refrescando token")
          console.log(e)
          console.log("DEBERIAMOS ACtuALIZAR el tokEn")
          if(session && session.user)
            session.user.access_token=e['access_token'];
          isRefreshing = false;

          return next(request);
        }),
        catchError((error) => {
          isRefreshing = false;

          if (error.status == '403') {
            session.user=null;
            router.navigate(['/login']);
          
          }

          return throwError(() => error);
        })
      );
    }
  }
  return next(request);
}
