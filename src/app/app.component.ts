import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { StravaService } from './services/strava.service';
import { LoginComponent } from './pages/login/login.component';
import { LocalSessionService } from './services/local-session.service';
import { RedirecService } from './services/redirec.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private session = inject(LocalSessionService)
  redirect = inject(RedirecService);

  constructor(private strava: StravaService, private route: ActivatedRoute,private router:Router) {
    // Manejo del código de autorización en la URL
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.strava.hideLoginPage();
        // Intercambia el código por un token de acceso
        this.strava.exchangeCodeForToken(code).subscribe(response => {
          // Aquí puedes manejar la respuesta, almacenar el token, etc.
          console.log('Token response:', response);
          this.strava.authUser(response as any);
          if(this.redirect.hasToRedirect()){
            window.location.replace(this.redirect.getRedirect() as any);
          }else{
            this.router.navigate(['/home']);
          }
        });
      }
    });
  }
}
