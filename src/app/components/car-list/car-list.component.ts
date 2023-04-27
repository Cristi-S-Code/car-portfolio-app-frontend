import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car.service';
// import { uuid } from 'uuidv4';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit{
  
  private _subscriptionList: Subscription[] = [];
  fileName = '';
  selectedCar?: Car;
  carForm!: FormGroup;
  idFromLink?: string;


  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
    ) {
      this._createForm();
    }

  ngOnInit(){
    this._subscriptionList.push();
    // this._getIdFromLink();
  }


  // ngOnDestroy(): void {
    
  //   this._subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  // }

  saveCar() {
    console.log("we are getting  here1")
    // let uniqueId = uuidv4().replace(/\D+/g,'');
    // const carId = parseInt(uniqueId,10);
    let uniqueId = 0;
    this.carForm.get('id')?.setValue(uniqueId);
    const newCar: Car = {
      id: this.selectedCar?.id ?? null,
      ...this.carForm.getRawValue()};
      this._createCar(newCar); //de adaugat si cond pt update later
      // this.resetForm()
    }

  private _createCar(newCar: Car) {
    console.log("we are getting  here2")
    // console.log("This is the new car tryng to create ===>", newCar)
      this._carService.createCar(newCar).pipe(take(1)).subscribe({
        next: () => {
          console.log("This is the new car created ===>", newCar),
          // this.resetForm(),
          this._router.navigate(['/car-list'])
        },
        error: () => alert('Object was not created. Call your IT responsable!')
      })
  }

  
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.carForm.get('image')?.setValue(file);
    }
    console.log("we are getting  here3")
  }

  private _createForm() {
    this.carForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      id:[null],
      image: [''],
      link: ['', [Validators.required]],
    });
    console.log("we are getting  here4")
  }

}
