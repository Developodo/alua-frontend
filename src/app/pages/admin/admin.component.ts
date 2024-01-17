import { Component, inject } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { Router } from '@angular/router';
import { LocalSessionService } from '../../services/local-session.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChallengesComponent } from '../challenges/challenges.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavComponent,ChallengesComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  session = inject(LocalSessionService);
  router = inject(Router);

  ngOnInit(): void {
    
    if(!this.session.user){
      this.router.navigate(['/login']);
    }else if(!this.session.isAdmin()){
      this.router.navigate(['/home']);
    }
    
  }
}
