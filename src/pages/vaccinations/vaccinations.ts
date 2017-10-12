import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-vaccinations',
  templateUrl: 'vaccinations.html',
})
export class VaccinationsPage {

  pets: Array<{ name: string, species: string, breed?: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pets = [
      { name: 'Rayo McQueen', species: 'Carro', breed: 'Veloz'},
      { name: 'Manuela', species: 'PonyDrilo', breed: 'Lindis'},
      { name: 'Prana', species: 'Gata', breed: 'De la calle'},
      { name: 'Mondá', species: 'Nutria'},
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VaccinationsPage');
  }

}
