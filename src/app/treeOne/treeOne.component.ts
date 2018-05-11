import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { TreeOneNodeService } from './treeOneNode.service';
import {
  IConfiguration,
  IContextMenu,
  ITreeData,
  ITreeState,
  NodeDispatcherService,
  TreeActionsService,
  TreeModel,
  treeStateSelector
} from '../../../projects/ngx-tree/src/public_api';

@Component({
  selector: 'app-tree-one',
  templateUrl: './treeOne.component.html'
})
export class TreeOneComponent implements OnInit {
  public folders: Observable<ITreeData>;

  public contextMenu: IContextMenu[] = [];

  public treeConfiguration: IConfiguration = {
    showAddButton: true,
    disableMoveNodes: false,
    treeId: 'tree3',
    dragZone: 'tree3',
    dropZone: ['tree3'],
    isAnimation: true
  };

  public treeModel: TreeModel;

  public constructor(private store: Store<ITreeState>,
    private treeActions: TreeActionsService,
    private nodeDispatcherService: NodeDispatcherService,
    private nodeService: TreeOneNodeService) {
  }

  public ngOnInit() {
    const treeId = this.treeConfiguration.treeId;
    this.nodeDispatcherService.register(treeId, this.nodeService);

    this.store.dispatch(this.treeActions.registerTree(treeId));

    this.folders = this.store.select(treeStateSelector)
      .pipe(
        map((data: ITreeState) => {
          return data[treeId];
        }),
        filter((data: ITreeData) => !!data)
      );

    this.treeModel = new TreeModel(this.folders, this.treeConfiguration);
  }
}
