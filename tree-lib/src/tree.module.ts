import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { NodeService } from './service/node.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeComponent } from './tree/tree.component';
import { DndModule, DraggableComponent } from 'ng2-dnd';
import { DragAndDrop } from './dragAndDrop/dragAndDrop.service';
import { DraggableDirective } from './dragAndDrop/draggable.directive';
import { DroppableDirective } from './dragAndDrop/droppable.directive';
import { DropzoneComponent } from './dragAndDrop/dropzone/dropzone.component';
import { TreeActionsService } from './store/treeActions.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TreeEffectsService } from './store/treeEffects.service';
import { NodeDispatcherService } from './service/nodesDispatcher.service';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { HttpClientModule } from '@angular/common/http';
import { treeReducer } from './store/treeReducer';
import { MaterialModule } from './material/material.module';
import { TreeItemService } from './service/tree-item.service';
import { TreeItemDirective } from './item/item.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DndModule,
    EffectsModule.forFeature([TreeEffectsService]),
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    StoreModule.forFeature('trees', treeReducer),
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
