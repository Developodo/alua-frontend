import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocalSessionService } from '../services/local-session.service';
import { StravaService } from '../services/strava.service';

export const authGuard: CanActivateFn = (route, state) => {
  const session=inject(LocalSessionService);
  const strava=inject(StravaService);
  
  return new Promise<boolean>(resolve => {
    if(session.user && session.user.athlete && !session.user.athlete.clubs){
      strava.getClubs().subscribe(d=>{
        session.user && (session.user.athlete.clubs=d);
        resolve(true);
      });
    }else{
      return resolve(session.user?true:false);
    }
  })

  
};
