import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TreeModule } from '../../../projects/ngx-tree/src/public_api';
import { TreeLocalStorageNodeService } from './treeLocalStorage.service';

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    TreeModule
  ],
  providers: [TreeLocalStorageNodeService]
})
export class TreeLocalStorageModule {
}
