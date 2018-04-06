import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { TreeItemService } from '../service/tree-item.service';

import { IFolderNode } from '../interfaces/IFolderNode';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Directive({
  selector: '[ri-tree-item]'
})
export class TreeItemDirective {
  @Output() execute: EventEmitter<IFolderNode> = new EventEmitter()
  @HostListener('click') trigger() {
    this.getFolder();
  }

  currentItem: IFolderNode;

  constructor(public treeItemSerice: TreeItemService, public elementRef: ElementRef) {
    this.treeItemSerice.folder.subscribe(current => this.currentItem = current);
  }

  public getFolder() {
    this.execute.emit(this.currentItem);
  }
}
