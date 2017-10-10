import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams,
  Platform, Events } from 'ionic-angular';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@IonicPage()
@Component({
  selector: 'page-pet-friendly',
  templateUrl: 'pet-friendly.html',
})
export class PetFriendlyPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  map: ElementRef;
  info: ElementRef;
  name: ElementRef;

  user: ElementRef;
  userClick: boolean = false;

  site: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public maps: GoogleMapsProvider,
    public ev: Events, public element: ElementRef, public renderer: Renderer) {
      this.ev.subscribe('maps:site', (data) => {
        this.site = data;
        this.switchDetail();
      });

      this.ev.subscribe('maps:user', () => {
        this.userClick = true;
        console.log('Click', this.userClick);
        this.switchUser();
      })
  }

  ngOnInit(){
    this.map = this.element.nativeElement.getElementsByClassName('map')[0];
    this.info = this.element.nativeElement.getElementsByClassName('info')[0];
    this.user = this.element.nativeElement.getElementsByClassName('user')[0];
    
    this.renderer.setElementStyle(this.map, 'webkitTransition', 'height 1000ms');
    this.renderer.setElementStyle(this.info, 'webkitTransition', 'height 1000ms');
    this.renderer.setElementStyle(this.user, 'webkitTransition', 'height 1000ms');
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      let mapLoaded = this.maps.init(this.mapElement.nativeElement,
        this.pleaseConnect.nativeElement);
    }).catch((err) =>{
      console.log('pet-friendly.ts ionViewDidLoad this.platform.ready()');
      console.log(err);
    });
  }

  switchDetail(){
    if(this.site){
      this.name = this.element.nativeElement.getElementsByClassName('site')[0];
      this.renderer.setElementStyle(this.map, 'height', '50%');
      this.renderer.setElementStyle(this.info, 'height', '50%');
      this.renderer.setElementStyle(this.info, 'display', 'inline');
      this.renderer.setElementStyle(this.user, 'display', 'none');
      this.renderer.setElementProperty(this.name, 'textContent', this.site.name);
    } else {
      this.renderer.setElementStyle(this.map, 'height', '100%');
      this.renderer.setElementStyle(this.info, 'height', '0%');
      this.renderer.setElementStyle(this.user, 'height', '0%');
    }
  }

  switchUser(){
    if(this.userClick){
      this.renderer.setElementStyle(this.map, 'height', '90%');
      this.renderer.setElementStyle(this.user, 'height', '10%');
      this.renderer.setElementStyle(this.user, 'display', 'inline');
      this.renderer.setElementStyle(this.info, 'display', 'none');
    } else {
      this.renderer.setElementStyle(this.map, 'height', '100%');
      this.renderer.setElementStyle(this.user, 'height', '0%');
    }
  }

  closeDetail(){
    this.site = undefined;
    this.switchDetail();
  }

  closeUser(){
    this.userClick = !this.userClick;
    this.switchUser();
  }

}
