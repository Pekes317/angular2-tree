import {Component, OnInit, ViewChild} from '@angular/core';
import {
  IOuterNode,
  ITreeItemEvent,
  TreeComponent,
  IConfiguration,
  IContextMenu,
  ITreeItemMoveEvent
} from '../../../../main';
import {TreeOneNodeService} from "./treeOneNode.service";

@Component({
  selector: 'app-tree-one',
  templateUrl: './treeOne.component.html'
})
export class TreeOneComponent implements OnInit {
  @ViewChild(TreeComponent)
  public treeComponent: TreeComponent;

  public folders: IOuterNode[] = [];

  public contextMenu: IContextMenu[] = [];

  public treeConfiguration: IConfiguration = {
    showAddButton: true,
    disableMoveNodes: false
  };

  public constructor(protected folderService: TreeOneNodeService) {

  }

  public ngOnInit() {
    this.folderService.load()
      .subscribe((folders: IOuterNode[]) => this.folders = folders);
  }

  public addNode() {
    this.treeComponent.addNode('Nowy element');
  }

  public onAdd(event: ITreeItemEvent) {
    console.log('onAdd', event);
    let node = event.node;
    let parentNode = node.parentNode;
    let parentNodeId = parentNode ? parentNode.id : null;

    this.folderService.save(event.node.data, parentNodeId)
      .subscribe(
        (folder: IOuterNode) => {
          node.refresh(folder);
        },
        () => {
          node.remove();
        }
      );
  }

  public onRemove(event: ITreeItemEvent) {
    console.log('onRemove', event);
    let node = event.node;

    this.folderService.remove(node.id)
      .subscribe(() => {
        node.remove();
      });
  }

  public onChange(event: ITreeItemEvent) {
    console.log('onChange', event);
    let node = event.node;

    this.folderService.update(node.toJSON())
      .subscribe((folder: IOuterNode) => {
        node.refresh(folder);
        node.collapse();
        node.expand();
      });
  }

  public onMove(event: ITreeItemMoveEvent) {
    console.log('Move', event);
    this.folderService.move(event.source, event.target)
      .subscribe(() => {
      });
  }

  public onToggle(event: ITreeItemEvent) {
    console.log('onToggle', event);
    if (event.status) {
      this.folderService.load(event.node.id)
        .subscribe((folders: IOuterNode[]) => {
          for (let folder of folders) {
            event.node.addChild(folder);
          }
        });
    } else {
      event.node.resetChildren();
    }

  }

  public onSelect(event: ITreeItemEvent) {
    console.log('onSelect', event);
  }
}