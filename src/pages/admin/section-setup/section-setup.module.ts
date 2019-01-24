import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SectionSetupPage } from './section-setup.page';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: '',
    component: SectionSetupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SectionSetupPage]
})
export class SectionSetupPageModule {}
