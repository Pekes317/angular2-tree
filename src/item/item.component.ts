import {
  Component, ViewChild, Input, ViewEncapsulation, OnInit, AfterViewInit
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ContextMenuComponent, ContextMenuService} from 'angular2-contextmenu';
import {IOuterNode} from '../interfaces/IOuterNode';
import {TreeActionsService} from '../store/treeActions.service';
import {Action, Store} from '@ngrx/store';
import {ITreeState} from '../store/ITreeState';
import {Observable} from 'rxjs/Observable';
import {TreeModel} from '../models/TreeModel';
import {Actions} from '@ngrx/effects';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'rign-tree-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less']
})
export class ItemComponent implements OnInit, AfterViewInit {
  /**
   * Input field where we can change node name
   */
  @ViewChild('inputElement') input: any;

  /**
   * Node instance
   */
  @Input() node: IOuterNode;

  @Input() treeModel: TreeModel;

  @Input() contextMenu: ContextMenuComponent;

  /**
   * Form field to change node name
   * @type {FormControl}
   */
  public nameField = new FormControl();

  public isEditMode = false;
  public isSelected = false;
  public isExpanded = false;

  public children$: Observable<IOuterNode[]>;


  protected insert$: Observable<Action> = this.actions$
    .ofType(TreeActionsService.TREE_INSERT_NODE)
    .filter((action: Action) => {
      return action.payload && action.payload === this.node.id;
    });

  protected isStartSave = false;


  /**
   * @param contextMenuService
   */
  public constructor(protected store: Store<ITreeState>,
                     protected treeActionsService: TreeActionsService,
                     protected contextMenuService: ContextMenuService,
                     protected actions$: Actions) {


    this.actions$
      .ofType(TreeActionsService.TREE_EXPAND_NODE)
      .filter((action: Action): boolean => {
        return !this.isExpanded && action.payload.node && this.node.id === action.payload.node.id;
      })
      .subscribe(() => {
        this.expand();
      });
  }

  public ngAfterViewInit() {
    if (this.isEditMode) {
      this.setFocus();
    }
  }

  public ngOnInit() {
    this.isEditMode = this.node.id === null;

    this.children$ = this.treeModel.getChildren(this.node.id);

    this.insert$
      .subscribe(() => {
        this.expand();
      });

    this.treeModel.currentSelectedNode$
      .subscribe((node: IOuterNode) => {
        this.isSelected = node && node.id === this.node.id;
      });

    this.actions$
      .ofType(TreeActionsService.TREE_EDIT_NODE_START)
      .filter((action: Action) => action.payload === this.node)
      .subscribe(() => {
        this.nameField.setValue(this.node.name);
        this.isEditMode = true;
        this.setFocus();
      });

  }

  public collapse() {
    this.isExpanded = false;
  }

  public expand() {
    this.isExpanded = true;

    this.store.dispatch(this.treeActionsService.loadTree(this.treeModel.treeId, this.node.id));
  }

  public onBlur() {
    if (this.isStartSave) {
      this.isStartSave = false;
      return;
    }

    this.undoChanges();
  }

  public onChange(event: KeyboardEvent) {
    event.stopPropagation();

    if (event.keyCode === 27) {
      this.undoChanges();
    } else if (event.keyCode === 13) {
      this.isStartSave = true;
      const node: IOuterNode = {
        id: this.node.id,
        treeId: this.node.treeId,
        name: this.nameField.value,
        parentId: this.node.parentId,
        children: this.node.children,
        parents: this.node.parents
      };

      this.store.dispatch(this.treeActionsService.saveNode(this.treeModel.treeId, node));
      this.isEditMode = false;
    }
  }

  public onContextMenu($event: MouseEvent) {
    if (!this.treeModel.configuration.disableContextMenu) {
      this.contextMenuService.show.next({
        contextMenu: this.contextMenu,
        event: $event,
        item: this.node
      });
    }

    $event.preventDefault();
    $event.stopPropagation();
  }

  public onSelect() {
    this.treeModel.currentSelectedNode$.next(this.isSelected ? null : this.node);
  }

  protected isNewNode() {
    return this.node.id === null;
  }

  protected setFocus() {
    setTimeout(() => this.input.nativeElement.focus());
  }

  protected undoChanges() {
    this.isEditMode = false;

    if (this.isNewNode()) {
      this.store.dispatch(this.treeActionsService.deleteNode(this.treeModel.treeId, this.node));
    }
  }
}