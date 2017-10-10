import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilProvider } from '../util/util';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationsProvider {

  veterinary: any;
  filterNearbyVets: any;
  petfriendly: any;
  currentPos: any;

  constructor(public http: Http, public geolocation: Geolocation, public util: UtilProvider) {  }

  loadPetfriendly(options) {
    return new Promise(resolve => {
        this.http.get('https://mappet.herokuapp.com/places/nearby?longitude=' 
        + options.lng + '&latitude=' 
        + options.lat + '&distance='
        + options.maxDistance + '&limit=15')
        .map(res => res.json())
        .subscribe(data => {
          this.petfriendly = data;
          resolve(this.petfriendly);
        });
    })
  }

  loadVeterinary(start:number = 0) {
    return new Promise(resolve => {
      this.geolocation.getCurrentPosition().then((position) => {
        this.currentPos = position.coords;
        this.http.get('https://mappet.herokuapp.com/places/nearbyVeterinary?longitude=' 
          + position.coords.longitude + '&latitude=' 
          + position.coords.latitude + '&limit=10'
          + '&distance=10&page='+ start)
        .map(res => res.json())
        .subscribe(data => {
          this.veterinary = this.applyHaversine(data);
          this.veterinary.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
          });
          resolve(this.veterinary);
        });
      }).catch((err) => {
        console.log('Error loadVeterinary Promise 48');
        console.log(err);
      });
    });
  }

  filterNearbyVeterinary(name: any){
    return new Promise(resolve => {
      this.http.get('http://mappet.herokuapp.com/places/filterNearbyVeterinary'
      +'?longitude='+ this.currentPos.longitude
      +'&latitude='+ this.currentPos.latitude+'&distance=10&limit=10'
      +'&filter=' + name)
      .map(res => res.json())
      .subscribe(data => {
        this.filterNearbyVets = this.applyHaversine(data);

        this.filterNearbyVets.sort((locationA, locationB) => {
          return locationA.distance - locationB.distance;
        });
        resolve(this.filterNearbyVets);
      });
    }).catch((err) => {
      console.log('Error Locations filterNearbyVeterinary Promise 70');
      console.log(err);
    });
  }

  filterVeterinary(searchTerm){
    return this.filterNearbyVeterinary(searchTerm);
  }

  applyHaversine(locations){
    let usersLocation = {
      lat: this.currentPos.latitude, 
      lng: this.currentPos.longitude
    };
 
    locations.map((location) => {
      let placeLocation = {
        lat: location.loc.coordinates[1],
        lng: location.loc.coordinates[0]
      };
 
      location.distance = this.util.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });

    return locations;
  }
}
