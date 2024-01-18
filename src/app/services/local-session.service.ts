import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { userStrava } from '../model/userStrava';

@Injectable({
  providedIn: 'root'
})
export class LocalSessionService {
  private _user:WritableSignal<userStrava | null> = signal(null);
  private _admin = computed(() => (this.user?.athlete?.id==1304824 || this.user?.athlete?.id==313764)?true : false);
  loaded=false;
  constructor() { }

  public isAdmin():boolean {
    return this._admin();
  }
  set user(user:userStrava|null) {
    this._user.set(user);
    localStorage.setItem('user', JSON.stringify(user)); 
  }
  get user():userStrava | null{
    if(this.loaded) {
      return this._user();
    }
    if(!this._user()) {
      this.loaded=true;
      const user = this.getFromLocalStorage();
      if(user) {
        this._user.set(user);
      }else{
        this._user.set(null);
      }
    }
    return this._user();
  }
  private getFromLocalStorage() : userStrava | null {
    const user = localStorage.getItem('user');
    if(user) {
      return JSON.parse(user) as userStrava;
    }
    return null;
  }
}
