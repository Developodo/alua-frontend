import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, ThemePalette } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StravaService } from '../../services/strava.service';
import { CommonModule } from '@angular/common';
import { club } from '../../model/club';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageCropperModule,
  LoadedImage,
} from 'ngx-image-cropper';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { DateAdapter} from '@angular/material/core'
import {MatStep, MatStepperModule} from '@angular/material/stepper';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { segment } from '../../model/segment';
import { KmPipe } from '../../pipes/km.pipe';
import {MatListModule} from '@angular/material/list';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { mockStrava } from '../../mock/mockStrava';
import { MapComponent } from '../../components/map/map.component';
import { ApiService } from '../../services/api.service';
import { challenge } from '../../model/challenge';
import { ViewChallengeComponent } from '../../components/challenge/view-challenge/view-challenge.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { LocalSessionService } from '../../services/local-session.service';
import { userStrava } from '../../model/userStrava';
import * as Leaflet from 'leaflet';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
interface status_image{
  image: string | null | undefined;
  croppedImage: any;
  imageChangedEvent: File | null;
  status: number;
}
interface status_club{
    clubselected: club | null;
    clubs: club[];
    clubsLoaded:boolean;
}

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    ImageCropperModule,
    MatStepperModule,
    CdkDropList, CdkDrag,
    KmPipe,
    MatListModule,
    MapComponent,
    ViewChallengeComponent,
    MatSlideToggleModule,
    MatButtonToggleModule
  ],
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.scss',
})

export class ChallengesComponent implements OnInit, AfterViewInit {
  private strava = inject(StravaService);
  public sanitizer = inject(DomSanitizer);
  private _snackBar: MatSnackBar=inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private api = inject(ApiService);
  private session = inject(LocalSessionService)
  private dateAdapter: DateAdapter<Date> = inject(DateAdapter)

  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  private searchSubject = new Subject<string>();

  private fb: FormBuilder=inject(FormBuilder);
  public myForm!: FormGroup<{
    name: FormControl<string|null>;
    duration: FormGroup<{
      start: FormControl<Date|null>;
      end: FormControl<Date|null>;
    }>;
    start: FormControl<Date|null>;
    end: FormControl<Date|null>;
    description: FormControl<string|null>;
    club: FormControl<number|null>;
  }>;

  image: WritableSignal<status_image> = signal({
    image: null,
    croppedImage: null,
    imageChangedEvent: null,
    status: 1, //1: inicial, 2: cargando, 3: cropping, 4:cropped, 5:error
  });
  club: WritableSignal<status_club> = signal({
    clubselected: null,
    clubs: [],
    clubsLoaded:false
  });

  segment: WritableSignal<any> = signal({
    segments: [],
    segments_filtered:[],
    segments_selected: [],
    segments_loaded: false,
    segments_page:1,
    segments_more:true, 
    segments_selected_detailed: [],
    segments_selected_loaded: false,
    distance: 0
  });
 
  challenge: WritableSignal<challenge> = signal({
    id: 0,
    name: '',
    image: '',
    total_elevation_gain: 0,
    description: '',
    club: null,
    type: '',
    start_date_local: '',
    end_date_local: '',
    stages: [],
    athletes: [],
    loaded:false
  })


  constructor(){
    this.dateAdapter.setLocale('es-ES'); //dd/MM/yyyy
    this.myForm = this.fb.group({
      name: new FormControl('',[Validators.required,Validators.minLength(6)]),
      duration: this.fb.group({
        start: new FormControl(today, [Validators.required]),
        end: new FormControl(today, [Validators.required]),
      }),
      start: new FormControl(today,[Validators.required]),
      end: new FormControl(today,[Validators.required]),
      description:new FormControl(''),
      club:new FormControl({value:-1,disabled:true},[Validators.required,Validators.min(0)]),
    })
  }


  colorControl = new FormControl('primary' as ThemePalette);

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(200)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  ngAfterViewInit() {
    console.log(this.session.user)
    if(this.session.user &&
          this.session.user?.athlete && 
          this.session.user?.athlete.clubs && 
          this.session.user?.athlete.clubs.length>0){
      this.club.update((c) => ({
        ...c,
        clubs: this.session.user?this.session.user.athlete.clubs:[],
        clubsLoaded:true
      }))
      this.myForm.get('club')?.enable();
    }else if(!this.session.user?.athlete.clubs || this.session.user?.athlete.clubs.length==0){
      this.strava.getClubs().subscribe((d) => {
        this.club.update((c) => ({
          ...c,
          clubs: d,
          clubsLoaded:true
        }))
        this.myForm.get('club')?.enable();
      });
    }
    
    
  }

  selectClub(club: any) {
    this.club.update((d) => ({ ...d, clubselected:  this.club().clubs.filter((c) => c.id == club)[0] }));
  }

  fileChangeEvent(event: any): void {
    this.image.update((d) => ({ ...d, imageChangedEvent: event, status: 2  }));
  }
  imageCropped(event: ImageCroppedEvent) {
    this.image.update((d) => ({
      ...d,
      croppedImage:event.base64,
      image: event.base64,
    }));
    console.log(event);
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
    this.image.update((d) => ({ ...d, status: 3 }));
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
    this.cancelcropping();
    this._snackBar.open("Error cargando la imagen","",{duration: 3000});

  }
  public crop() {
    this.image.update((d) => ({ ...d, status: 4 }));
    this.imageCropper.crop();
  }
  public cancelcropping() {
    this.image.set({
      image: null,
      croppedImage: null,
      imageChangedEvent: null,
      status: 1, //1: inicial, 2: cargando, 3: cropping, 4:cropped, 5:error
    });
  }

  public removeImage() {
    const dref:MatDialogRef<ConfirmComponent> = this.dialog.open(ConfirmComponent,{
      closeOnNavigation:true,
      data:{
        title:'Eliminar la imagen',
        content:'¿Deseas quitar esta imagen al reto?'  
      },
      width:"50%"
    });
    dref.afterClosed().subscribe(result=>{
      if(result){
        this.image.set({
          image: null,
          croppedImage: null,
          imageChangedEvent: null,
          status: 1, //1: inicial, 2: cargando, 3: cropping, 4:cropped, 5:error
        });
      }
    })

  }
  public loadStarredSegments(){
    this.strava.getStarredSegments(this.segment().segments_page).subscribe((d : any)=>{
      //segments activity_type Ride Run
      //clubs.clubselected sport_type cycling running
      this.segment.update((s:any)=>({
        ...s,
        segments:d.filter((s:any)=>(s.activity_type=='Ride' && this.club().clubselected?.sport_type=='cycling') || 
        (s.activity_type=='Run' && this.club().clubselected?.sport_type=='running')) as any,
        segments_filtered:d.filter((s:any)=>(s.activity_type=='Ride' && this.club().clubselected?.sport_type=='cycling') || 
        (s.activity_type=='Run' && this.club().clubselected?.sport_type=='running')) as any,
        segments_loaded:true,
        segments_page:this.segment().segments_page+1,
        segments_more:d.length==30?true:false
      }))
    })
  }
  public saveChallenge_step1(){
    if(!this.myForm.valid) return;
    this.myForm.get('club')?.enable({onlySelf:false});

    this.strava.getStarredSegments().subscribe((d : any)=>{
      //segments activity_type Ride Run
      //clubs.clubselected sport_type cycling running
      this.segment.update((s:any)=>({
        ...s,
        segments:d.filter((s:any)=>(s.activity_type=='Ride' && this.club().clubselected?.sport_type=='cycling') || 
        (s.activity_type=='Run' && this.club().clubselected?.sport_type=='running')) as any,
        segments_filtered:d.filter((s:any)=>(s.activity_type=='Ride' && this.club().clubselected?.sport_type=='cycling') || 
        (s.activity_type=='Run' && this.club().clubselected?.sport_type=='running')) as any,
        segments_loaded:true,
        segments_page:this.segment().segments_page+1,
        segments_more:d.length==30?true:false
      }))
    })

  }

  saveChallenge_step2(){
    this.segment.update((s:any)=>({
      ...s,
      segments_selected_loaded:false
    }))
    
    const resquests:Observable<any>[]=[]
    for(let r of this.segment().segments_selected){
      resquests.push(this.strava.getSegmentById(r.id));
    }
    forkJoin(resquests).subscribe((d)=>{
      console.log(d);
      const di=d.map(die=>{
        return {...die,reps:1,anydate:false}
      })

      this.segment.update((s:any)=>({
        ...s,
        segments_selected_detailed:di,
        segments_selected_loaded:true
      }))
    })
   /* mockStrava.getTwoDetailedSegment().subscribe((d)=>{
      this.segment.update((s:any)=>({
        ...s,
        segments_selected_detailed:d,
        segments_selected_loaded:true
      }))
    })*/
  }

  public selectSegment(event: any){
    const changes = event.options;
    const tmpSelected = this.segment().segments_selected;
    for(let i=0;i<changes.length;i++){
      if(changes[i].selected && !tmpSelected.includes(changes[i].value)){
        tmpSelected.push(changes[i].value);
      }
      if(!changes[i].selected && tmpSelected.includes(changes[i].value)){
        tmpSelected.splice(tmpSelected.indexOf(changes[i].value),1);
      }
      
    }
    this.segment.update((s:any)=>({
      ...s,
      segments_selected:tmpSelected,
      distance:tmpSelected.map((s:any)=>s.distance).reduce((a:any,b:any)=>a+b,0)
    }))
  }

  public  myFilter = (d: Date | null): boolean => {
    if(d && this.myForm?.controls?.duration?.value?.start && this.myForm?.controls?.duration?.value?.end && (d<this.myForm?.controls?.duration?.value?.start || d>this.myForm?.controls?.duration?.value?.end)){
      return false
    }else{
      return true;
    }
  };

  public saveChallenge_step3(){
    this.challenge.update((c:any)=>({
      ...c,
      loaded:false
    }))
   
    let veryLastMoment=this.myForm?.controls?.duration?.value?.end;
    if(this.myForm?.controls?.duration?.value.end)
      veryLastMoment = new Date(this.myForm?.controls?.duration?.value?.end.setUTCHours(23,0,0));
    const request = {
      name: this.myForm?.controls?.name?.value,
      distance: this.segment().distance,
      image: this.image().image==null?'/assets/imageD.jpeg':this.image().image,
      total_elevation_gain: this.segment().segments_selected_detailed.map((s:any)=>s.total_elevation_gain).reduce((a:any,b:any)=>a+b,0),
      description: this.myForm?.controls?.description?.value,
      club: this.club().clubselected,
      type: this.club().clubselected?.sport_type,
      stages: this.segment().segments_selected_detailed,
      start_date_local: this.myForm?.controls?.duration?.value?.start,
      end_date_local: veryLastMoment
    };
    console.log(request);
    this.api.saveChanlleges(request).subscribe((d:any)=>{
      console.log(d);
      this.challenge.set({
        ...d,
        loaded:true
      })
    })

  }

  /**
   * Open a new window to https://www.strava.com/segments/{id}
   * @param id 
   */
  public visitStrava(id:any){
    window.open(`https://www.strava.com/segments/${id}`);
  }



  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch(event:any) {
    this.searchSubject.next(event.target.value);
  }

  performSearch(searchValue: string) {
    searchValue = searchValue.trim();
    if(!searchValue) {
      this.segment.update((s:any)=>({
        ...s,
        segments_filtered:s.segments
      }))
      return;
    }
    this.segment.update((s:any)=>({
      ...s,
      segments_filtered:s.segments.filter((s:any)=>s.name.toLowerCase().includes(searchValue.toLowerCase()))
    }))
  }
}
