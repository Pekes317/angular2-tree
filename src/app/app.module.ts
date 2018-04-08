import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DndModule } from 'ng2-dnd';
import { TranslateModule, TranslateService } from 'ng2-translate';

import { AppComponent } from './app.component';
import { TreeOneModule } from './treeOne/treeOne.module';
import { TreeTwoModule } from './treeTwo/treeTwo.module';
import { TreeModule } from '../../tree-lib/src/tree.module';

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
