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

  challenges:challenge[]=[]
  challenges_loaded=false

  ngOnInit(): void {
    console.log(this.session.user);
    if(!this.session.user){
      this.router.navigate(['/login']);
    }

    if(!this.challenges_loaded){

      this.api.getChallenges().subscribe(response=>{
        this.challenges=response as any;
        this.challenges_loaded=true
      })
    }
    
  }

  viewChallenge(id:number){
    this.router.navigate(['/challenge',id]);
  }
 }