// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-header',
  // templateUrl: './header.component.html',
  // styleUrls: ['./header.component.scss']
// })
// export class HeaderComponent {

// }

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private modalService: NgbModal) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

}