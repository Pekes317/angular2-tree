import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Observable';

import { NodeService, IOuterNode } from '../../../projects/ngx-tree/src/public_api';

@Injectable()
export class TreeLocalStorageNodeService extends NodeService {
  protected treeName = 'tree';

  protected nodes: IOuterNode[];

  public load(nodeId = ''): Observable<IOuterNode[]> {
    if (!this.nodes) {
      this.nodes = this.getAllDataFromLocalStorage();
    }

    const nodes = this.getChildren(nodeId);

    return Observable.of(nodes);
  }

  public add(node: IOuterNode, parentNodeId: string = null): Observable<IOuterNode> {
    node.parentId = parentNodeId;
    node.id = UUID.UUID();

    this.nodes.push(node);

    this.saveNodes();

    return Observable.of(node);
  }

  public move(srcNode: IOuterNode, targetNode: IOuterNode | null): Observable<IOuterNode> {
    const srcId = srcNode.id;
    const targetId = targetNode ? targetNode.id : null;

    const index = this.findIndexByNodeId(srcId);

    this.nodes[index].parentId = targetId;
    this.saveNodes();

    return Observable.of(this.nodes[index]);
  }

  public update(node: IOuterNode): Observable<IOuterNode> {
    const index = this.findIndexByNodeId(node.id);

    this.nodes[index] = node;
    this.saveNodes();

    return Observable.of(node);
  }

  public remove(nodeId: string): Observable<IOuterNode> {
    const index = this.findIndexByNodeId(nodeId);
    const node = this.nodes[index];

    const hasChildren = this.getChildren(nodeId).length > 0;

    if (!hasChildren) {
      this.nodes.splice(index, 1);

      this.saveNodes();

      return Observable.of(node);
    } else {
      return Observable.throw('Node is not empty');
    }

  }

  private findIndexByNodeId(nodeId: string): number {
    return this.nodes.findIndex((node) => {
      return node.id === nodeId;
    });
  }

  private getChildren(nodeId: string): IOuterNode[] {
    return this.nodes.filter((node: IOuterNode) => node.parentId === nodeId);
  }


  protected getAllDataFromLocalStorage(): IOuterNode[] {
    try {
      const data = localStorage.getItem(this.treeName)

      if (data) {
        return JSON.parse(data);
      }

      return [];

    } catch (e) {
      return [];
    }
  }

  private saveNodes() {
    try {
      localStorage.setItem(this.treeName, JSON.stringify(this.nodes));
    } catch (e) {
      console.warn('State not save');
    }
  }
}
