import { Component } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  smallScreen: Observable<any> = this.breakpoint.observe('(max-width: 840px)');
  isSmall: BreakpointState;
  
  constructor(private breakpoint: BreakpointObserver) { }

  ngOnInit() {
    this.smallScreen.subscribe(
      size => this.isSmall = size);
  }
}
