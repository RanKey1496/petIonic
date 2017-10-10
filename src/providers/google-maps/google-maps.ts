import { Injectable, transition } from '@angular/core';
import { Events } from 'ionic-angular';
import { ConnectivityProvider } from '../connectivity/connectivity';
import { LocationsProvider } from '../locations/locations';
import { UtilProvider } from '../util/util';
import { Geolocation } from '@ionic-native/geolocation';
import { mapStyle } from './mapStyle';

declare var google;

@Injectable()
export class GoogleMapsProvider {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentPosition: boolean;
  currentLat: number = 0;
  currentLng: number = 0;
  markers: any = [];
  infoWindows: any = [];
  apiKey: string;

  constructor(public connectivityProvider: ConnectivityProvider, 
    public geolocation: Geolocation, public locations: LocationsProvider,
    public util: UtilProvider, public ev: Events) {
      this.currentPosition = false;
      this.apiKey = 'AIzaSyCGvYOmfZmmH6vmf_7VPfDR5XEo2KQNsGk';
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    return this.loadGoogleMaps();
  }

  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve) => {
      if(typeof google == 'undefined' || typeof google.maps == 'undefined'){
        console.log('Google Maps JavaScript needs to be loaded.');
        this.disableMap();

        if(this.connectivityProvider.isOnline()){
          window['mapInit'] = () => {
            this.initMap().then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          let script = document.createElement('script');
          script.id = 'googleMaps';

          if(this.apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' 
              + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);
          console.log('Google Maps JavaScript loaded.');
        }
        
      } else {
        if(this.connectivityProvider.isOnline()){
          this.initMap();
          this.enableMap();
        } else {
          this.disableMap();
        }
      }

      this.addConnectivityListeners();
    });
  }

  disableMap(): void {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = 'block';
    }
  }

  enableMap(): void {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = 'none';
    }
  }

  initMap(): Promise<any> {
    this.mapInitialised = true;

    return new Promise((resolve) => {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, 
        position.coords.longitude);

        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;

        let mapOptions = {
          center: latLng,
          zoom: 16,
          styles: mapStyle,
          mapTypeControl: false,
          navigationControl: false,
          streetViewControl: false,
          zoomControl: false,
          scaleControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.loadMarkers();

          google.maps.event.addListener(this.map, 'dragend', () => {
            this.loadMarkers();
          });

          google.maps.event.addListener(this.map, 'zoom_changed', () => {
            this.loadMarkers();
          });
        });
        
        this.reloadMarkers();        

        resolve(true);
      });
    });
  }

  addConnectivityListeners(): void {
    document.addEventListener('online', () => {
      console.log('google-maps.ts addConnectivityListeners online');

      setTimeout(() => {
        if(typeof google == 'undefined' || typeof google.maps == 'undefined'){
          this.loadGoogleMaps();
        } else {
          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);
    }, false);

    document.addEventListener('offline', () => {
      console.log('google-maps.ts addConnectivityListeners offline');
      
      this.disableMap();
    }, false);
  }

  loadMarkers(){
    let center = this.map.getCenter(),
        bounds = this.map.getBounds(),
        zoom = this.map.getZoom();
    
    let centerNorm = {
      lat: center.lat(),
      lng: center.lng()
    };

    let boundsNorm = {
      northEast: {
        lat: bounds.getNorthEast().lat(),
        lng: bounds.getNorthEast().lng()
      },
      southWest: {
        lat: bounds.getSouthWest().lat(),
        lng: bounds.getSouthWest().lng()
      }
    };

    let boundingRadius = this.getBoundingRadius(centerNorm, boundsNorm);

    let options = {
      lng: centerNorm.lng,
      lat: centerNorm.lat,
      maxDistance: boundingRadius
    };

    this.getMarkers(options);
    this.getCurrent();
  }

  getCurrent(){
    if(!this.currentPosition){
      let lat = this.currentLat;
      let lng = this.currentLng;
      let latLng = {lat, lng};
      let markerLatLng = new google.maps.LatLng(this.currentLat, this.currentLng);

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: markerLatLng,
        icon: 'assets/icon/pin-user.png'
      });

      google.maps.event.addListener(marker, 'click', () => {
        this.closeAllInfoWindows();
        this.ev.publish('maps:user');
        this.map.panTo(latLng);
        this.map.panBy(0, 100);
      })
      this.currentPosition = true;
    }
  }

  getMarkers(options) {
    let petfriendly = this.locations.loadPetfriendly(options);
    Promise.all([
      petfriendly
    ]).then((result) => {
      let markers = result[0];
      this.addMarkers(markers);
    }).catch((err) => {
      console.log('google-maps.ts getMarkers Promise');
      console.log(err);
    })
  }

  addMarkers(petfriendly) {
    let marker;
    let markerLatLng;
    let lat;
    let lng;

    petfriendly.forEach((marker) => {

      let data;
      lat = marker.loc.coordinates[1];
      lng = marker.loc.coordinates[0];
      let latLng = {lat, lng};
      data = marker;

      markerLatLng = new google.maps.LatLng(lat, lng);

      if(!this.markerExists(lat, lng)){
        marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: markerLatLng,
          icon: 'assets/icon/pin-selected.png'
        });

        let markerData = {
          lat: lat,
          lng: lng,
          marker: marker
        };

        google.maps.event.addListener(marker, 'click', () => {
          this.closeAllInfoWindows();
          marker.setIcon('assets/icon/pin-site.png');
          this.ev.publish('maps:site', data);
          this.map.panTo(latLng);
          this.map.panBy(0, 100);
        })

        this.markers.push(markerData);
      }
    })
  }

  reloadMarkers(){
    this.markers.forEach((marker) => {
      marker.marker.setMap(null);
      marker.marker.setMap(this.map);
    });
  }

  addInfoWindow(markerData, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    this.infoWindows.forEach(window => {
      window.close();
    });

    this.markers.forEach(data => {
      data.marker.setIcon('assets/icon/pin-selected.png');
    })
  }

  markerExists(lat, lng) {
    let exists = false;

    this.markers.forEach((marker) => {
      if(marker.lat === lat && marker.lng === lng){
        exists = true;
      }
    });

    return exists;
  }

  getBoundingRadius(center, bounds){
    return this.util.getDistanceBetweenPoints(center, bounds.northEast, 'km');    
  }
}
