import { MatMenu } from '@angular/material/menu';
import { IOuterNode } from './IOuterNode';

export interface IFolderNode {
	contextMenu: MatMenu;
	event: MouseEvent;
	item: IOuterNode;
}