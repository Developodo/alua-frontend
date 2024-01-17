import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { challenge } from '../../../model/challenge';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MapComponent } from '../../map/map.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { KmPipe } from '../../../pipes/km.pipe';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { ShareModule } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons'
import { MatMenuModule } from '@angular/material/menu';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTelegram,faTwitter,faFacebook,faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const icons = [
  // ... other icons
  faFacebook,
  faWhatsapp,
  faTwitter,
  faTelegram,
  faLink
];



@Component({
  selector: 'app-view-challenge',
  standalone: true,
  imports: [CommonModule,MatCardModule,MapComponent,MatIconModule,KmPipe,MatButtonModule,ShareIconsModule,ShareButtonsModule,MatMenuModule ],
  templateUrl: './view-challenge.component.html',
  styleUrl: './view-challenge.component.scss'
})
export class ViewChallengeComponent implements OnChanges{
  @Input() challenge!: challenge;

  constructor(iconLibrary: FaIconLibrary){
    iconLibrary.addIcons(...icons);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.challenge)
  }
  visitStrava(id:number){
    window.location.href=`https://www.strava.com/segments/${id}`
  }

  viewClub(
  ){
    
    window.location.href=`https://www.strava.com/clubs/${this.challenge.club?.id}`;
  }
}
