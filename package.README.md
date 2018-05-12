# ngx-tree

This package is a fork of [@rign/angular2-tree](https://www.npmjs.com/package/@rign/angular2-tree) package adjusted to use @angular/material instead of bootstrap and ngx-contextmenu.

This version of the package also uses Google's Material Design icons instead of Font Awesome.

### Update News

* Update Angular to Angular 6.0
* Requires a Feature Module with that below imports

~~~~ 
@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([TreeEffectsService]),
    StoreModule.forFeature('trees', treeReducer),
  ],
  declarations: []
})
export class FolderModule { } 
~~~~