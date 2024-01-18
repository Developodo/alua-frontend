import { Component, Input, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet'; 
import 'leaflet-fullscreen';
import * as polyline from "@mapbox/polyline"
import { MatIcon, MatIconModule } from '@angular/material/icon';


Leaflet.Icon.Default.imagePath = 'assets/';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule,MatIconModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  @Input() route:any;
  @Input() start:any;
  @Input() end:any;
  public modeSatellite = false;

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];


  osm = new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
   // useCache:true,
    attribution: "OpenStreet",
  })

   
  esriAerial = new Leaflet.TileLayer("https://server.arcgisonline.com/ArcGIS/rest/services" +
  "/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, " +
    "USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the" +
    " GIS User Community",
  });

  ngOnInit(): void {
   
  }

  initMarkers(start:any,end:any) {
    console.log(start,end)
    const initialMarkers = [
      {
        position: { lat:start[0], lng: start[1] },
        draggable: true
      },
      {
        position: { lat: end[0], lng: end[1] },
        draggable: false
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      let icon;
      if(index==0){
        icon = Leaflet.icon({
          iconUrl: 'assets/icons/start.png',
          className: 'icon',
          iconSize:     [32, 32], // size of the icon
          iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
      });
      }

      if(index==initialMarkers.length-1){
        icon = Leaflet.icon({
          iconUrl: 'assets/icons/end.png',
          className: 'icon',
          iconSize:     [32, 32], // size of the icon
          iconAnchor:   [0, 32], // point of the icon which will correspond to marker's location
      });
      }
      const data = initialMarkers[index];
      const marker = Leaflet.marker(data.position, { icon:icon,draggable: data.draggable })
      marker.addTo(this.map);
    }
  }



  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.osm.addTo(this.map);

    let firstpolyline = new Leaflet.Polyline(polyline.decode(this.route), {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
  });
  firstpolyline.addTo(this.map);
  //let bounds = new Leaflet.LatLngBounds(this.start, this.end);
  //this.map.fitBounds(bounds);
  this.map.fitBounds(firstpolyline.getBounds());
  this.initMarkers(this.start,this.end);

  (Leaflet.control as any).fullscreen({
    position: "topleft", // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
    title: "Show me the fullscreen !", // change the title of the button, default Full Screen
    titleCancel: "Exit fullscreen mode", // change the title of the button when fullscreen is on, default Exit Full Screen
    content: '', // change the content of the button, can be HTML, default null
    forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
    forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
    fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
  }).addTo(this.map);

  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }


  public changeModeSatelite(event:any) {
    event.preventDefault();
    event.stopPropagation();
    if (this.modeSatellite) {
      this.modeSatellite = false;
      this.esriAerial.removeFrom(this.map);
      this.osm.addTo(this.map);
      //document.getElementById(this.idS + this.sufix).style.color =
        //"rgba(35, 45, 57, 0.796)";
    } else {
      this.modeSatellite = true;
      this.osm.removeFrom(this.map);
      this.esriAerial.addTo(this.map);
      //document.getElementById(this.idS + this.sufix).style.color =
        //"rgba(64, 128, 206, 0.796)";
    }
  }

}
