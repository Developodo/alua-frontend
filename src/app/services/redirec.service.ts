import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirecService {

  constructor() { }

  setRedirect(url:string){
    localStorage.setItem('redirect',url);
  }
  getRedirect(){
    const url=localStorage.getItem('redirect');
    localStorage.removeItem('redirect');
    return url;
  }
  hasToRedirect(){
    return localStorage.getItem('redirect')
  }
}
