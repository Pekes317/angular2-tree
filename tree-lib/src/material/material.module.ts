import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  exports: [
		MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule
  ],
  declarations: []
})
export class MaterialModule { }