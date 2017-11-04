import {Component, OnChanges, Input, ViewEncapsulation, ViewChild, OnInit} from '@angular/core';
import {IOuterNode} from './interfaces/IOuterNode';
import {IContextMenu} from './interfaces/IContextMenu';
import {TreeModel} from './models/TreeModel';
import {ContextMenuComponent} from 'angular2-contextmenu';
import {DragAndDrop} from './dragAndDrop/dragAndDrop.service';
import {IDragAndDrop} from './interfaces/IDragAndDrop';
import {TreeActionsService} from './store/treeActions.service';
import {Store} from '@ngrx/store';
import {ITreeState} from './store/ITreeState';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'rign-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit, OnChanges {
  @Input() treeModel: TreeModel;

  @ViewChild('contextMenu') contextMenu: ContextMenuComponent;

  /**
   * List of default options for context menu
   *
   * @type {{name: string; text: string; iconCls: string}[]}
   */
  private defaultOptions: IContextMenu[] = [
    {
      name: 'onEdit',
      text: 'RI_TREE_LBL_EDIT_NODE',
      iconCls: 'fa fa-edit'
    },
    {
      name: 'onDelete',
      text: 'RI_TREE_LBL_REMOVE_NODE',
      iconCls: 'fa fa-trash'
    }
  ];

  /**
   * List of context menu items
   *
   * @type {Array}
   */
  public menuList: IContextMenu[] = [];

  public constructor(protected store: Store<ITreeState>,
                     protected treeActions: TreeActionsService,
                     protected dragAndDrop: DragAndDrop) {

  }

  public ngOnInit() {
    this.registerMove();
  }

  public ngOnChanges(data: any) {
    this.menuList = [];
    this.defaultOptions.forEach((item) => this.menuList.push(item));
  }

  public onAdd() {
    const parent = this.treeModel.currentSelectedNode$.getValue();
    const parentId = parent ? parent.id : null;

    this.store.dispatch(this.treeActions.expandNode(this.treeModel.treeId, parent));
    this.store.dispatch(this.treeActions.insertNode(this.treeModel.treeId, parentId));
  }

  /**
   * On select item from context menu
   *
   * @param name - name of the event
   * @param node - data item
   */
  public onContextMenuClick(name: string, node: IOuterNode) {

    switch (name) {
      case 'onEdit':
        event.stopPropagation();
        this.store.dispatch(this.treeActions.editNodeStart(node));
        break;
      case 'onDelete':
        this.store.dispatch(this.treeActions.deleteNode(this.treeModel.treeId, node));
        break;
      default:
        console.warn('Unknown context menu action: ' + name);
    }
  }

  /**
   * Register data "move event"
   */
  protected registerMove(): void {
    if (this.treeModel.configuration.disableMoveNodes) {
      return;
    }

    this.dragAndDrop.drop$
      .filter((data: IDragAndDrop) => {
        if (data.type === DragAndDrop.DROP_DATA_TYPE) {
          if (data.dropNode) {
            return data.dropNode.data.treeId === this.treeModel.treeId;
          } else {
            return data.dragNode.data.treeId === this.treeModel.treeId;
          }
        } else {
          if (data.dropNode && data.dropNode.zones && data.dropNode.zones.indexOf(data.dragNode.zoneId) === -1) {
            return false;
          }

          return true;
        }
      })
      .subscribe((data: IDragAndDrop) => {

        const dropNode = data.dropNode ? data.dropNode.data : null;
        this.store.dispatch(this.treeActions.moveNode(data.type, this.treeModel.treeId, data.dragNode.data, dropNode));
      });
  }
}