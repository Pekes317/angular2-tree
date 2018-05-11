import { Injectable } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';

import { IFolderNode } from '../interfaces/IFolderNode';

@Injectable()
export class TreeItemService {

  public folder: Subject<IFolderNode> = new Subject();
  public trigger: MatMenuTrigger;

  constructor() { }

  public pickFolder(myFolder: IFolderNode) {
    this.folder.next(myFolder);
  }

  public setTrigger(menuTrigger: MatMenuTrigger) {
    this.trigger = menuTrigger;
  }
}
