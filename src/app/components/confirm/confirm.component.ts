import { Component, Inject, InjectionToken, Input, Optional, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

  dref = inject(MatDialogRef<ConfirmComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
   // console.log(this.data);
  }
  public accept(){
    this.dref.close(true)
  }
  public cancel(){
    this.dref.close(false);
  }
}
