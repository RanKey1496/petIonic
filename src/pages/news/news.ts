import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  news: Array<{title: string, date: string, image: string, favorites: number, opinions: number, liked?: boolean}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.news = [
      { title: 'Parque de Belén', date: "Hace 5 horas", image: "https://unsplash.it/600/400", favorites: 12, opinions: 3, liked: true },
      { title: 'Jornada de Vacunación', date: "Hace 23 horas", image: "https://unsplash.it/599/400", favorites: 52, opinions: 6},
      { title: 'Recuerda vacunar tus mascotas', date: "Ayer, a las 3 pm", image: "https://unsplash.it/600/399", favorites: 2, opinions: 4 },
      { title: 'Higiene para tus mascotas', date: "5 de septiembre", image: "https://unsplash.it/600/388", favorites: 135, opinions: 8, liked: true },
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  openDetail(n){
    console.log(n);
  }

  toggleFavorite(n) {
    this.news.forEach((data) => {
      if(data == n){
        if(data.liked){
          data.liked = false;
        } else {
          data.liked = true;
        }

        console.log(data.liked);
      }
    });
  }

}
