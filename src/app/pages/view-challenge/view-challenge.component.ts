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
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedirecService } from '../../services/redirec.service';
import { lastValueFrom } from 'rxjs';
import { StravaService } from '../../services/strava.service';



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
  _snackBar = inject(MatSnackBar);
  redirect=inject(RedirecService)
  strava=inject(StravaService);

  subscribing=false;
  
  @Input() id = '';
  api = inject(ApiService);
  challenge!: challenge;
  loaded=false;
  found:any=undefined;

  ngOnInit(): void {
    this.api.getChallenge(Number(this.id)).subscribe((d: any) => {
      if(!d){
        if(this.session.user)
          this.router.navigate(['/home']);
        else
          this.router.navigate(['/login']);
        return;
      }
      if(!Array.isArray(d.athletes)){
        d.athletes=[];
      }
      this.found =d.athletes?.filter((a: any)=>a.id==this.session.user?.athlete?.id);
      this.challenge = d
      this.loaded=true;
    })
  }
  async subscription(event: any){
    this.found = this.challenge.athletes?.filter((a: any)=>a.id==this.session.user?.athlete?.id);
    if(this.challenge.end_date_local<this.today || (this.found.length>0 && this.found[0].performance)){
      event.source.checked =false;
      return;
    }
    if(!this.session.user){
      event.source.checked =false;
      this._snackBar.open("Inicia sesión para inscribirte", "Vamos!")
      .afterDismissed().subscribe(()=>{
        this.redirect.setRedirect(window.location.href);
        this.router.navigate(['/login'])
      });
      return;
    }
    if(event.checked){
      //LOADINGGGGGGG
      //fuegos artificiales
      this.subscribing=true;
      await lastValueFrom(this.api.subscribeChallenge(Number(this.id)));
      
      /*buscar this.session.user.athlete.id en this.challenge.athletes*/
      if(!this.found || this.found.length==0){
        if(!this.found){
          this.found=[];
        }
        this.found.push(this.session.user?.athlete as any);
        this.challenge.athletes?.push(this.session.user?.athlete as any);
      }
        

        const idSegments = this.challenge.stages?.map((s: any)=>s.id);
        await this.strava.starSegments(idSegments)
        this.subscribing=false;
      try {
        this.confetti({
          angle: this.random(80, 120),
          spread: this.random(20, 50),
          particleCount: this.random(80, 200),
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
      dref.afterClosed().subscribe(async result=>{
         //alert de seguro
         if(result){
          this.found=false;
          this.subscribing=true;
          this.challenge.athletes=this.challenge.athletes?.filter((a: any)=>a.id!=this.session.user?.athlete?.id);
          await lastValueFrom(this.api.unsubscribeChallenge(Number(this.id)));
          this.subscribing=false;
          
        }else{
           event.source.checked = true;
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
