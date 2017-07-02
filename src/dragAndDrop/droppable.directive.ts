import {Directive, ElementRef, Input, OnInit, Renderer} from '@angular/core';
import {DragAndDrop} from './dragAndDrop.service';
import {IOuterNode} from '../interfaces/IOuterNode';

export interface DropConfig {
  dropAllowedCssClass?: string;
  dropZone?: string[] | null;
}


@Directive({
  selector: '[ri-droppable]'
})
export class Droppable implements OnInit {
  @Input() node: IOuterNode;
  @Input() dropConfig: DropConfig = {};

  public constructor(protected el: ElementRef, private renderer: Renderer, protected dragAndDrop: DragAndDrop) {
    renderer.listen(el.nativeElement, 'dragover', ($event) => {
      $event.preventDefault();
      const dropAllowed = this.isDropAllowed();

      this.changeTargetCursor($event, dropAllowed);
      this.toggleDropClass(dropAllowed);
    });

    renderer.listen(el.nativeElement, 'dragleave', ($event) => {
      $event.preventDefault();
      this.toggleDropClass(false);
    });

    renderer.listen(el.nativeElement, 'drop', () => {
      this.toggleDropClass(false);
      this.dragAndDrop.dragEnd({zones: this.dropConfig.dropZone, node: this.node});
    });
  }

  public ngOnInit() {
    this.initConfig();

    if (!this.node) {
      throw 'Droppable needs node';
    }
  }

  /**
   * Add or remove additional class when drop allowed
   * @param dropAllowed
   */
  private toggleDropClass(dropAllowed = false) {
    this.renderer.setElementClass(this.el.nativeElement, this.dropConfig.dropAllowedCssClass, dropAllowed);
  }

  private isDropAllowed = function () {
    const lastDragElement = this.dragAndDrop.getLastDragElement();
    const source = lastDragElement.node;
    const target = this.node;
    const dropZone = this.dropConfig.dropZone;

    if (dropZone && dropZone.length > 0) {
      return dropZone.indexOf(lastDragElement.zoneId) > -1;
    }

    // todo: check drag and drop zones
    return !(source === target || target.id === source.parentId || target.parents.indexOf(source.id) > -1);
  };

  /**
   * Change drag event cursor
   * @param $event
   * @param add
   */
  private changeTargetCursor($event: DragEvent, add = false) {
    const cursorType = add ? 'copy' : 'none';

    $event.dataTransfer.effectAllowed = cursorType;
    $event.dataTransfer.dropEffect = cursorType;
  }

  /**
   * initialize configuration options, use default or passed
   */
  private initConfig(): void {
    const defaultConfig: DropConfig = {
      dropAllowedCssClass: 'drop-allowed'
    };

    for (const key in defaultConfig) {
      this.dropConfig[key] = this.dropConfig[key] || defaultConfig[key];
    }
  }
}