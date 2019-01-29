import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MasterSetupPage } from './master-setup.page';
import { MasterSetupRoutingModule } from './master-setup-routing.module';
import { CostCentreSetupPageModule } from '../cost-centre-setup/cost-centre-setup.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterSetupRoutingModule,
    CostCentreSetupPageModule
  ],
  declarations: [MasterSetupPage]
})
export class MasterSetupPageModule {}
