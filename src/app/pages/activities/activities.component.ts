import { Component } from '@angular/core';
import { StravaService } from '../../services/strava.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {
  activities: any[] = [];

  constructor(private stravaS: StravaService) {}

  ngOnInit() {

    this.stravaS.getActivities().subscribe(
      (data: any) => {
        this.activities = data;
      },
      error => {
        console.error('Error al obtener las actividades:', error);
      }
    );
  }
}
