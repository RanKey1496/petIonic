import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';

declare var Connection;

@Injectable()
export class ConnectivityProvider {

  onDevice: boolean;

  constructor(public platform: Platform, public network: Network) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if(this.onDevice && this.network.type){
      return this.network.type === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }
}
