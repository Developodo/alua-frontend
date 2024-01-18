import { Component, Input, inject } from '@angular/core';
import { LocalSessionService } from '../../services/local-session.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StravaService } from '../../services/strava.service';
import { RedirecService } from '../../services/redirec.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,MatButtonModule,MatMenuModule,RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  @Input() root:string="false";
  public session = inject(LocalSessionService);
  public strava = inject(StravaService);
  redirect = inject(RedirecService);
  router = inject(Router);
  public athlete = this.session.user?.athlete

  dialog = inject(MatDialog);

  public goToProfile(){
    const dref:MatDialogRef<ConfirmComponent> = this.dialog.open(ConfirmComponent,{
      closeOnNavigation:true,
      data:{
        title:'Ir a Strava',
        content:'¿Deseas visitar tu perfil de Strava?'  
      },
      width:"50%"
    });
    dref.afterClosed().subscribe(result=>{
      if(result){
        window.location.href=`https://www.strava.com/athletes/${this.athlete?.id}`;
      }
    })
  }
  public logout(){
    console.log("CERRAR")
    const dref:MatDialogRef<ConfirmComponent> = this.dialog.open(ConfirmComponent,{
      closeOnNavigation:true,
      data:{
        title:'Cerrar Sesión',
        content:'¿Deseas salir de Aluas?'  
      },
      width:"50%"
    });
    dref.afterClosed().subscribe(result=>{
      if(result){
        this.strava.logout();
      }
    })
    
  }

  public admin(){
    if(this.session.isAdmin()){
      this.router.navigate(['/admin']);
    }
  }
  public home(){
    if(this.session.isAdmin()){
      this.router.navigate(['/home']);
    }
  }

  public login(){
    this.redirect.setRedirect(window.location.href);
    this.router.navigate(['/login']);
  }
}
