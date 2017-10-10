import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NewsPage } from '../pages/news/news';
import { PetFriendlyPage } from '../pages/pet-friendly/pet-friendly';
import { VeterinariesPage } from '../pages/veterinaries/veterinaries';
import { VaccinationsPage } from '../pages/vaccinations/vaccinations';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PetFriendlyPage;

  pages: Array<{title: string, component: any, notifications?: number}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'News', component: NewsPage },
      { title: 'Sites', component: PetFriendlyPage },
      { title: 'Veterinaries', component: VeterinariesPage },
      { title: 'Vaccinations', component: VaccinationsPage, notifications: 2 },
      { title: 'Settings', component: SettingsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
