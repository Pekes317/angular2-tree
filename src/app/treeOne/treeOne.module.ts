import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TreeOneNodeService } from './treeOneNode.service';
import { TreeOneComponent } from './treeOne.component';
import { TreeModule } from '../../../projects/ngx-tree/src/public_api';

@NgModule({
  declarations: [TreeOneComponent],
  exports: [TreeOneComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TreeModule
  ],
  providers: [TreeOneNodeService]
})
export class TreeOneModule {
}
