import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocalSessionService } from '../services/local-session.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const session=inject(LocalSessionService);
  return session.isAdmin();
};
