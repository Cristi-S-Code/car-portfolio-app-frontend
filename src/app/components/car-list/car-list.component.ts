import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, map, take } from 'rxjs';
import { Car } from 'src/app/models/car';
import { FileHandle } from 'src/app/models/file-handle.model';
import { ImageModel } from 'src/app/models/image-model';
import { CarService } from 'src/app/services/car.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
// import { uuid } from 'uuidv4';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit{
  
  subscriptionList: Subscription[] = [];
  fileName = '';
  selectedCar?: Car;
  carForm!: FormGroup;
  idFromLink?: string;
  carList: Car[] = [];
  formDataRetrieved: any;
  imageModel: any;
  object: Object = Object.keys;
  data!: FileHandle[];

  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _router: Router,
    private _splashScreenStateService: SplashScreenStateService,
    private _imageProcessingService: ImageProcessingService,
    ) {
      this._createForm();
    }

  ngOnInit(){
    this._splashScreenStateService.stop();
    this.subscriptionList.push(
      this._carService.getAllCars()
      .pipe(
        take(1),
        map((x: ImageModel[], i) => x.map((car: ImageModel) => this._imageProcessingService.createImages(car)))
        )
      .subscribe({
        next: (list: ImageModel[]) => {
          console.log('this is the list');
          console.log(list); 
          console.log('get all cars request is working');
            this.imageModel = list;
            console.log(this.imageModel); 
        },
        error: () => console.log("the subscription for car was unsuccessfull")
        
      }),
    );

    // this._getIdFromLink();
  }

  // ngOnDestroy(): void {
  //   // Every subscription needs to be unsubscribed to avoid memory leaks!
  //   this.subscriptionList.forEach((sub) => sub.unsubscribe())
  // }

  resetForm() {
    this.carForm.reset();
  }
  

  // ngOnDestroy(): void {
    
  //   this._subscriptionList.forEach((sub: Subscription) => sub.unsubscribe());
  // }

 

  saveCar() {
    console.log("we are getting  here1")
    // let uniqueId = uuidv4().replace(/\D+/g,'');
    // const carId = parseInt(uniqueId,10);
    let uniqueId = 10;
    this.carForm.get('id')?.setValue(uniqueId);
    const newCar: Car = {
      id: this.selectedCar?.id ?? null,
      ...this.carForm.getRawValue()};
      this._createCar(newCar); //de adaugat si cond pt update later
      // this.resetForm()
    }

  private _createCar(newCar: Car) {
    console.log("we are getting  here2")
    console.log("This is the new car tryng to create ===>", newCar)

      const productFormData = this.prepareFormData(newCar);
      console.log("This is the new formdata tryng to create ===>", productFormData)
      this._carService.createCar(productFormData).pipe(take(1)).subscribe({
        next: () => {
          console.log("This is the new car created ===>", newCar),
          this.resetForm(),
          this._router.navigate(['/car-list'])
        },
        error: () => alert('Object was not created. Call your IT responsable!')
      })
  }

  prepareFormData(car: Car): FormData {
    const formData = new FormData;

    formData.append(
      'newCar',
      new Blob([JSON.stringify(car)], {type: 'application/json'})
    );

    formData.append(
      'imageFile',
      car.image,
      car.image.name
    )  
     //for multiple images   
    // for(let i=0; i<car.image.length; i++) {
    //   formData.append(
    //     'imageFile',
    //     car.image[i].file,
    //     car.image[i].file.name
    //   );
    // }
    return formData;
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
      id:[''],
      image: [''],
      link: ['', [Validators.required]],
    });
    console.log("we are getting  here4")
  }


  // this is the logic for carousel part
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  
}
