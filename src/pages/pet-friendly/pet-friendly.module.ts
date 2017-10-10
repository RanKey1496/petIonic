import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetFriendlyPage } from './pet-friendly';

@NgModule({
  declarations: [
    PetFriendlyPage,
  ],
  imports: [
    IonicPageModule.forChild(PetFriendlyPage),
  ],
})
export class PetFriendlyPageModule {}
