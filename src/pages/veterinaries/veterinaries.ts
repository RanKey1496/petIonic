import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-veterinaries',
  templateUrl: 'veterinaries.html',
})
export class VeterinariesPage {

  vets: Array<{title: string, dir: string, distance: number}>

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.vets = [
      { title: "Carmenchis SA", dir: "Calle 30a #75-34", distance: 0.4 },
      { title: "Peluditos Lindos", dir: "Carrera 75 #32-38", distance: 1 },
      { title: "Gatico Cariñosito", dir: "Calle 33 #25-14", distance: 1.3 },
      { title: "Clinica Veterinaria Aguapanela", dir: "Calle 80 #79-84", distance: 4 },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VeterinariesPage');
  }

}
