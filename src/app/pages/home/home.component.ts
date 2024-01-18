import { Component, OnInit, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LocalSessionService } from '../../services/local-session.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { NavComponent } from '../../components/nav/nav.component';
import { ChallengesComponent } from '../challenges/challenges.component';
import { CardChallengeComponent } from '../../components/challenge/card-challenge/card-challenge.component';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { challenge } from '../../model/challenge';
import { ApiService } from '../../services/api.service';
import { StravaService } from '../../services/strava.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent,CardChallengeComponent,MatProgressBarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  public session = inject(LocalSessionService)
  api = inject(ApiService);
  router = inject(Router);
  strava = inject(StravaService);

  challenges:challenge[]=[]
  challenges_loaded=false

  ngOnInit(): void {
    console.log(this.session.user);
    console.log(localStorage.getItem('url'))
    if(!this.session.user){
      this.router.navigate(['/login']);
      return;
    }


    if(this.session.user && this.session.user.athlete && !this.session.user.athlete.clubs){
      this.strava.getClubs().subscribe(d=>{
        this.session.user && (this.session.user.athlete.clubs=d);
        if(!this.challenges_loaded){
          if(this.session.user && this.session.user.athlete.clubs && this.session.user.athlete.clubs.length>0){
            let ids = this.session.user.athlete.clubs.map((c:any)=>c.id).join(",")
            this.api.getChallengesByClubs(ids).subscribe(response=>{
              this.challenges=response as any;
              this.challenges_loaded=true
            })
          }
          /*this.api.getChallenges().subscribe(response=>{
            this.challenges=response as any;
            this.challenges_loaded=true
          })*/
        }
      })
    }
    

    
    
  }

  viewChallenge(id:number){
    this.router.navigate(['/challenge',id]);
  }
 }