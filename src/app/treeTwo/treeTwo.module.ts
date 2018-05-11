import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule, TreeModule } from '../../../projects/ngx-tree/src/public_api';
import { TreeTwoComponent } from './treeTwo.component';
import { NewItemComponent } from './newItem.component';
import { TreeTwoNodeService } from './treeTwoNode.service';
import { TreeLocalStorageModule } from '../localStorage/treeLocalStorage.module';

@NgModule({
  declarations: [
    TreeTwoComponent,
    NewItemComponent
  ],
  exports: [TreeTwoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TreeLocalStorageModule,
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [TreeTwoNodeService]
})
export class TreeTwoModule {
}
