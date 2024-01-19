import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { KmPipe } from '../../../pipes/km.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { challenge } from '../../../model/challenge';

@Component({
  selector: 'app-card-challenge',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatIconModule,KmPipe,MatButtonModule],
  templateUrl: './card-challenge.component.html',
  styleUrl: './card-challenge.component.scss'
})
export class CardChallengeComponent {
  today=new Date(new Date()).toISOString()
  @Input() challenge!: challenge;

  ngOnInit(){
    console.log(this.challenge.start_date_local);
    console.log(this.challenge.end_date_local);
    console.log(this.today)
  }
}
