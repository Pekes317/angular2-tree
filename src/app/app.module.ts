import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';
import { TreeOneModule } from './treeOne/treeOne.module';
import { TreeTwoModule } from './treeTwo/treeTwo.module';
import { MaterialModule, TreeModule } from '../../projects/ngx-tree/src/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    DndModule.forRoot(),
    HttpClientModule,
    LayoutModule,
    MaterialModule,
    TreeTwoModule,
    TreeOneModule,
    TreeModule.forRoot(),
    TranslateModule.forRoot(),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  public constructor(translate: TranslateService) {
    translate.use('en');
  }
}
