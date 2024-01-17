import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { ChallengesComponent } from './pages/challenges/challenges.component';
import { ViewChallengeComponentPage } from './pages/view-challenge/view-challenge.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login/:url', component: LoginComponent },
    { path: 'activities', component: ActivitiesComponent },
    { path: 'challenge/:id', component:ViewChallengeComponentPage},
    { path: 'challenges', component: ChallengesComponent },
    { path: 'home', component: HomeComponent,canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent,canActivate: [authGuard,adminGuard] },

    { path: '**', redirectTo: '' },
];
