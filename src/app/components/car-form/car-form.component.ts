import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent implements OnInit{

  constructor() {

  }

  ngOnInit(){
    
  }
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  

}
