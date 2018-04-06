import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { IFolderNode } from '../interfaces/IFolderNode';

@Injectable()
export class TreeItemService {

  public folder: Subject<IFolderNode> = new Subject();

  constructor() { }

  public pickFolder(myFolder: IFolderNode) {
    this.folder.next(myFolder);
  }
}
