import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { challenge } from '../../model/challenge';
import { CommonModule } from '@angular/common';
import { ViewChallengeComponent } from '../../components/challenge/view-challenge/view-challenge.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavComponent } from '../../components/nav/nav.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { LocalSessionService } from '../../services/local-session.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';



@Component({
  selector: 'app-view-challenge-page',
  standalone: true,
  imports: [CommonModule,ViewChallengeComponent,MatIconModule,MatProgressBarModule,NavComponent,MatCardModule,MatSlideToggleModule,MatExpansionModule],
  templateUrl: './view-challenge.component.html',
  styleUrl: './view-challenge.component.scss'
})
export class ViewChallengeComponentPage{
  session = inject(LocalSessionService);
  private dialog = inject(MatDialog);
  today=new Date(new Date()).toISOString();
  router=inject(Router);
  
  @Input() id = '';
  api = inject(ApiService);
  challenge!: challenge;
  loaded=false;
  found:any=undefined;

  ngOnInit(): void {
    console.log(this.id);
    this.api.getChallenge(Number(this.id)).subscribe((d: any) => {
      console.log(d);
      if(!Array.isArray(d.athletes)){
        d.athletes=[];
      }
      this.found =d.athletes?.filter((a: any)=>a.id==this.session.user?.athlete?.id);
      console.log(this.found)
      this.challenge = d
      this.loaded=true;
    })
  }
  subscription(event: any){
    if(!this.session.user || this.challenge.end_date_local<this.today){
      return;
    }
    if(event.checked){
      //fuegos artificiales
      this.api.subscribeChallenge(Number(this.id)).subscribe((d:any)=>console.log(d));
      /*buscar this.session.user.athlete.id en this.challenge.athletes*/
      if(!this.found || this.found.length==0)
        this.challenge.athletes?.push(this.session.user?.athlete as any);
      
      try {
        this.confetti({
          angle: this.random(60, 120),
          spread: this.random(10, 50),
          particleCount: this.random(40, 50),
          origin: {
              y: 0.6
          }
        });
      } catch(e) {
        // noop, confettijs may not be loaded yet
      }
    }else{
      const dref:MatDialogRef<ConfirmComponent> = this.dialog.open(ConfirmComponent,{
        closeOnNavigation:true,
        data:{
          title:'Retirarse del reto',
          content:'¿Estás seguro que deseas dejar de participar?'  
        },
        width:"50%"
      });
      dref.afterClosed().subscribe(result=>{
         //alert de seguro
         if(result){
          this.found=false;
          this.challenge.athletes=this.challenge.athletes?.filter((a: any)=>a.id!=this.session.user?.athlete?.id);
          this.api.unsubscribeChallenge(Number(this.id)).subscribe((d:any)=>console.log(d));
         }
     
        
      })
     
    }
   
  }
  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  confetti(args: any) {
    return (window as any)['confetti'].apply(this, arguments);
  }

  deleteChallenge(){
    const dref:MatDialogRef<ConfirmComponent> = this.dialog.open(ConfirmComponent,{
      closeOnNavigation:true,
      data:{
        title:'Eliminar la reto',
        content:'¿Deseas eliminar reto?'  
      },
      width:"50%"
    });
    dref.afterClosed().subscribe(result=>{
      if(result){
      this.loaded=false;
      this.api.deleteChallenge(Number(this.id)).subscribe((d:any)=>{
        this.router.navigate(['/home']);
      });
    }
    })


    
  }

  viewAthlete(id:number){
    window.location.href=`https://www.strava.com/athletes/${id}`;
  }
}
