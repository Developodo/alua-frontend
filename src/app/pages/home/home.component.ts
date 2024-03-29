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
  imports: [NavComponent,CardChallengeComponent,MatProgressBarModule,MatIconModule,MatButtonModule],
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
  challenges_page=1;
  challenges_has_more=true;


  ngOnInit(): void {
    console.log(this.session.user);
    console.log(localStorage.getItem('url'))
    if(!this.session.user){
      this.router.navigate(['/login']);
      return;
    }
    this.loadChallenges();
  }

  viewChallenge(id:number){
    this.router.navigate(['/challenge',id]);
  }

  loadChallenges(){
    console.log(this.session.user)
    if(this.session.user && this.session.user.athlete.clubs && this.session.user.athlete.clubs.length>0){
      let ids = this.session.user.athlete.clubs.map((c:any)=>c.id).join(",")
      this.challenges_loaded=false;
      console.log(ids,this.challenges_page)
      this.api.getChallengesByClubs(ids,this.challenges_page).subscribe((r:any)=>{
        console.log(r)
        if(r.length==0){  
          this.challenges_has_more=false;
          this.challenges_loaded=true;
        }else{
          this.challenges=[...this.challenges,...r];//la api trae 3 de cada grupo
          this.challenges_loaded=true;
          this.challenges_page++;
          this.challenges_has_more=r.length<3?false:true;
        }
        
      })
    }else{
      this.challenges=[];
      this.challenges_loaded=true
    }
  }
 }