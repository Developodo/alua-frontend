import { Injectable, inject } from '@angular/core';
import { mockStrava } from '../mock/mockStrava';
import { mockApi } from '../mock/mockApi';
import { HttpClient } from '@angular/common/http';
import { LocalSessionService } from './local-session.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
   apiURL=environment.urlApi;
  session = inject(LocalSessionService);

  constructor(private http: HttpClient) { }

  /**
   * Envía a la api un post con los datos del reto. Petición http post.
   */
  saveChanlleges(challenge:any) {
    //return mockApi.getDetailedChallenge();

    const segmentUrl = `${this.apiURL}challenges`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    };

    const body = {
      name: challenge.name
      ,description:challenge.description
      ,image:challenge.image
      ,total_elevation_gain:challenge.total_elevation_gain
      ,club:challenge.club
      ,type:challenge.type
      ,start_date_local:challenge.start_date_local
      ,end_date_local:challenge.end_date_local
      ,stages:challenge.stages
      ,athletes:{}};
      console.log("--------")
      console.log(body)
    return this.http.post(segmentUrl, body, header);
    
  }
  getChallenge(id:number){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges/${id}`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    return this.http.get(segmentUrl, header);
  }

  getChallenges(){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    return this.http.get(segmentUrl, header);
  }

  getChallengesByClubs(ids:string,page=1){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges/clubs/${ids}/page/${page}`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    return this.http.get(segmentUrl, header);
  }
  getChallengesByClub(id:number){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges/clubs/${id}`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    return this.http.get(segmentUrl, header);
  }

  subscribeChallenge(id:number){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges/subscribe/${id}`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    const body=this.session.user?.athlete;
    return this.http.patch(segmentUrl, body,header);
  }

  unsubscribeChallenge(id:number){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges/unsubscribe/${id}`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    const body=this.session.user?.athlete;
    return this.http.patch(segmentUrl, body,header);
  }

  deleteChallenge(id:number){
    //return mockApi.getDetailedChallenge();
    const segmentUrl = `${this.apiURL}challenges/${id}`;
    //const headers = { Authorization: `Bearer ${this.sessionService.user?.access_token}` };
    const header = {};
    const body=this.session.user?.athlete;
    return this.http.delete(segmentUrl, header);
  }
}
