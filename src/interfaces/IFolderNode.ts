import { ContextMenuComponent } from 'ngx-contextmenu';
import { IOuterNode } from './IOuterNode';

export interface IFolderNode {
	contextMenu: ContextMenuComponent;
	event: MouseEvent;
	item: IOuterNode;
}