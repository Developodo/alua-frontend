import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { userStrava } from '../model/userStrava';
import { Observable, of } from 'rxjs';
import { LocalSessionService } from './local-session.service';
import { club } from '../model/club';
import { mockStrava } from '../mock/mockStrava';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StravaService {
  private sessionService = inject(LocalSessionService);

  private clientId = '118853';
  private clientSecret = '4548c33a927509d1427852d4535fe85a4fa0a29b'
  private redirectUri = environment.frontURL;
  private authUrl = 'https://www.strava.com/oauth/authorize';
  private tokenUrl = 'https://www.strava.com/oauth/token';
  public isLoginHided = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  // Redirige al usuario a la página de autorización de Strava
  login() {
    const url = `${this.authUrl}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=read_all,activity:read_all`;
    window.location.href = url;
  }

  authUser(user:userStrava) {
    this.sessionService.user=user;
    if(localStorage.getItem('url')){
      const url=localStorage.getItem('url');
      localStorage.removeItem('url');
      this.router.navigate([url]);
    }else{
      this.router.navigate(['/home']);
    }
    
  }

  logout(){
    this.sessionService.user=null;
    this.isLoginHided.set(false);
    this.router.navigate(['/login']);
  }

  refreshLogin(){
    return new Promise((resolve,reject)=>{

    
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: this.sessionService.user?.access_token
    };
    this.http.post(this.tokenUrl, body).subscribe(response => {
     // this.sessionService.user={...this.sessionService.user,...response};

      resolve(true);
    },error=>{
      this.sessionService.user=null;
      this.router.navigate(['/login']);
      reject(error);
    })
  })
  }
  // Intercambia el código de autorización por un token de acceso
  exchangeCodeForToken(code: string) {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
    };

    return this.http.post(this.tokenUrl, body);
  }

  getActivities() {
    if(!this.sessionService.user) {
      return of([]);
    }
    const activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };

    return this.http.get(activitiesUrl, { headers });
  }

  getSegmentById(id: number) {
    if(!this.sessionService.user) {
      return of([]);
    }
    const segmentUrl = `https://www.strava.com/api/v3/segments/${id}`;
    const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    console.log(segmentUrl)
    return this.http.get(segmentUrl, { headers });
  }

  getStarredSegments(page=1) {
    //return mockStrava.getStarredSegments();

    if(!this.sessionService.user) {
      return of([]);
    }
    const starredUrl = 'https://www.strava.com/api/v3/segments/starred?page='+page;
    const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };

    return this.http.get(starredUrl, { headers });
  }
  getClubs() :Observable<club[] | any>{

    //return mockStrava.getClubs();

    if(!this.sessionService.user) {
      return of([]);
    }
    const groupsUrl = 'https://www.strava.com/api/v3/athlete/clubs';
    const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };

    return this.http.get(groupsUrl, { headers }) as any;
  }

  public hideLoginPage(){
    this.isLoginHided.set(true);
  }

}
