import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VeterinariesPage } from './veterinaries';

@NgModule({
  declarations: [
    VeterinariesPage,
  ],
  imports: [
    IonicPageModule.forChild(VeterinariesPage),
  ],
})
export class VeterinariesPageModule {}
