import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { NewsPage } from '../pages/news/news';
import { PetFriendlyPage } from '../pages/pet-friendly/pet-friendly';
import { VeterinariesPage } from '../pages/veterinaries/veterinaries';
import { VaccinationsPage } from '../pages/vaccinations/vaccinations';
import { SettingsPage } from '../pages/settings/settings';

import { LocationsProvider } from '../providers/locations/locations';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { UtilProvider } from '../providers/util/util';

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    PetFriendlyPage,
    VeterinariesPage,
    VaccinationsPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    PetFriendlyPage,
    VeterinariesPage,
    VaccinationsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationsProvider,
    GoogleMapsProvider,
    ConnectivityProvider,
    UtilProvider
  ]
})
export class AppModule {}
