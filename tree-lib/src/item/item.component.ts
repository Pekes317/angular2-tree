import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { AnimationTriggerMetadata } from '@angular/animations/src/animation_metadata';
import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { IOuterNode } from '../interfaces/IOuterNode';
import { TreeActionsService } from '../store/treeActions.service';
import { Action, Store } from '@ngrx/store';
import { ITreeAction, ITreeState, ITreeActionPayload } from '../store/ITreeState';
import { Observable } from 'rxjs/Observable';
import { TreeModel } from '../models/TreeModel';
import { Actions } from '@ngrx/effects';
import { IFolderNode } from '../interfaces/IFolderNode';
import { filter } from 'rxjs/operators';
import { TreeItemService } from '../service/tree-item.service';


export function expand(): AnimationTriggerMetadata {
  return trigger('isExpanded', [
    state('inactive', style({
      height: 0,
      opacity: 0,
      transform: 'scaleY(0)'
    })),
    state('active', style({
      transform: 'scaleY(1)'
    })),
    transition('inactive => active', animate('300ms')),
    transition('active => inactive', animate('300ms'))
  ]);
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ri-tree-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less'],
  animations: [expand()]
})
export class ItemComponent implements OnInit, AfterViewInit {
  /**
   * Input field where we can change data name
   */
  @ViewChild('inputElement') input: any;
  @ViewChild(MatMenuTrigger) contextMenuTrigger: MatMenuTrigger;


  /**
   * Node instance
   */
  @Input() node: IOuterNode;

  @Input() treeModel: TreeModel;

  @Input() contextMenu: MatMenu;

  /**
   * Form field to change data name
   */
  public nameField = new FormControl();

  public isEditMode = false;
  public isSelected = false;
  public isExpanded = false;
  public animationState = null;

  public children$: Observable<IOuterNode[]>;


  protected insert$: Observable<Action> = this.actions$
    .ofType(TreeActionsService.TREE_INSERT_NODE)
    .pipe(
      filter((action: ITreeAction<ITreeActionPayload>) => {
        return action.payload && action.payload.id === this.node.id;
      })
    );

  protected isStartSave = false;


  public constructor(protected store: Store<ITreeState>,
    protected treeActionsService: TreeActionsService,
    protected treeItemService: TreeItemService,
    protected actions$: Actions) {
    actions$
      .ofType(TreeActionsService.TREE_EXPAND_NODE)
      .pipe(
        filter((action: ITreeAction<ITreeActionPayload>): boolean => {
          return !this.isExpanded && action.payload.node && this.node.id === action.payload.node.id;
        })
      )
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
    if (this.treeModel.configuration.isAnimation) {
      this.animationState = 'inactive';
    }

    this.isEditMode = this.node.id === null;

    this.children$ = this.treeModel.getChildren(this.node.id);

    this.insert$
      .pipe(
        filter((action: ITreeAction<ITreeActionPayload>) => {
          return Boolean(action.payload.id);
        })
      )
      .subscribe(() => {
        this.expand();
      });

    this.treeModel.currentSelectedNode$
      .subscribe((node: IOuterNode) => {
        this.isSelected = (node && node.id === this.node.id) ? true : false;
      });

    this.actions$
      .ofType(TreeActionsService.TREE_EDIT_NODE_START)
      .pipe(
        filter((action: ITreeAction<ITreeActionPayload>) => action.payload.node === this.node)
      )
      .subscribe((action: ITreeAction<ITreeActionPayload>) => {
        this.nameField.setValue(this.node.name);
        this.isEditMode = true;
        this.setFocus();
      });

  }

  public expand() {
    this.isExpanded = !this.isExpanded;
    if (this.treeModel.configuration.isAnimation) {
      this.animationState = this.isExpanded ? 'active' : 'inactive';
    }

    this.store.dispatch(this.treeActionsService.loadTree(this.treeModel.treeId, this.node.id));
  }

  public onAnimationDone($event: AnimationEvent): void {
    if ($event.toState === 'inactive') {
      this.isExpanded = false;
    }
  }

  public onBlur() {
    if (this.isStartSave) {
      this.isStartSave = false;
    } else {
      this.undoChanges();
    }
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
    let folder: IFolderNode = {
      contextMenu: this.contextMenu,
      event: $event,
      item: this.node
    };

    if (!this.treeModel.configuration.disableContextMenu) {
      this.treeItemService.pickFolder(folder);
    }
    this.treeItemService.setTrigger(this.contextMenuTrigger);
    this.contextMenuTrigger.openMenu();

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
