import { Component, Input, inject } from '@angular/core';
import { StravaService } from '../../services/strava.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple, MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,MatRippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input() url = undefined;
  strava = inject(StravaService);
  loginToStrava() {
    //return;
    if(this.url) {
      localStorage.setItem('url', this.url);
    }else{
      localStorage.removeItem('url');
    }
    this.strava.login();
  }

}
