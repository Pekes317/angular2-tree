import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DndModule, DraggableComponent } from 'ng2-dnd';

import { TreeComponent } from './tree/tree.component';
import { TreeEffectsService } from './store/treeEffects.service';
import { NodeDispatcherService } from './service/nodesDispatcher.service';
import { DragAndDrop } from './dragAndDrop/dragAndDrop.service';
import { DraggableDirective } from './dragAndDrop/draggable.directive';
import { DroppableDirective } from './dragAndDrop/droppable.directive';
import { DropzoneComponent } from './dragAndDrop/dropzone/dropzone.component';
import { TreeActionsService } from './store/treeActions.service';
import { treeReducer } from './store/treeReducer';
import { MaterialModule } from './material/material.module';
import { TreeItemService } from './service/tree-item.service';
import { TreeItemDirective } from './item/item.directive';
import { ItemComponent } from './item/item.component';
import { NodeService } from './service/node.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DndModule,
    EffectsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    StoreModule,
    TranslateModule,
  ],
  declarations: [TreeComponent, ItemComponent, TreeItemDirective, DraggableDirective, DroppableDirective, DropzoneComponent],
  exports: [TreeComponent, ItemComponent, DraggableDirective, DroppableDirective, DropzoneComponent, DraggableComponent, StoreModule, EffectsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TreeModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TreeModule,
      providers: [
        DragAndDrop,
        NodeDispatcherService,
        NodeService,
        TreeActionsService,
        TreeEffectsService,
        TreeItemService
      ]
    }
  }

  public constructor(private translate: TranslateService) {
    this.setTranslationForEN();
    this.setTranslationForPL();
    this.translate.use('en');
  }

  private setTranslationForPL(): void {
    this.translate.setTranslation('pl', {
      RI_TREE_LBL_ADD_NODE: 'Dodaj',
      RI_TREE_LBL_EDIT_NODE: 'Edytuj',
      RI_TREE_LBL_REMOVE_NODE: 'Usuń',
      RI_TREE_LBL_DROP_ZONE: 'Upuść tutaj'
    });
  }

  private setTranslationForEN(): void {
    this.translate.setTranslation('en', {
      RI_TREE_LBL_ADD_NODE: 'Add data',
      RI_TREE_LBL_EDIT_NODE: 'Edit data',
      RI_TREE_LBL_REMOVE_NODE: 'Delete data',
      RI_TREE_LBL_DROP_ZONE: 'Drop here to move data to root level'
    });
  }
}
