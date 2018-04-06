import { TestBed, inject } from '@angular/core/testing';

import { TreeItemService } from './tree-item.service';

describe('TreeItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeItemService]
    });
  });

  it('should be created', inject([TreeItemService], (service: TreeItemService) => {
    expect(service).toBeTruthy();
  }));
});
