import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCarousel, NgbModal, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, map, take } from 'rxjs';
import { Car } from 'src/app/models/car';
import { FileHandle } from 'src/app/models/file-handle.model';
import { ImageModel } from 'src/app/models/image-model';
import { CarService } from 'src/app/services/car.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { ToastService } from 'src/app/services/toast.service';
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
  editForm!: FormGroup;
  object: Object = Object.keys;
  data!: FileHandle[];
  url: any;
  urlToEdit: any;
  urlHolder: any;


  @ViewChild('fileInput', {static: false})
  myInputVariable!: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _carService: CarService,
    private _router: Router,
    private _splashScreenStateService: SplashScreenStateService,
    private _imageProcessingService: ImageProcessingService,
    private _toastService: ToastService
    ) {
      this._createForm();
      this._editForm();
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
    this.url = null;
    this.myInputVariable.nativeElement.value = '';
  }

  saveCar() {
    console.log("we are getting  here1")
    // let uniqueId = uuidv4().replace(/\D+/g,'');
    // const carId = parseInt(uniqueId,10);
    // console.log(carId);
    
    const carId = new Date().getTime();  
    console.log(carId);
    
    this.carForm.get('id')?.setValue(carId);
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
          // console.log("This is the new car created ===>", newCar),
          this.resetForm();
          this.url = null;
          // this._router.navigate(['/car-list']),

          // const index = this.carList.findIndex(((p: { id: string; }) => p.id === newCar.id));
          // let indexToString = index.toString();
          this._toastService.show('Car added successfully', { classname: 'bg-primary text-light fs-2', delay: 3000 });
          // if (index !== -1) {
          //    this.carList.push();
          // }


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
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target!.result;
      }
    }
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

  private _editForm() {
    this.editForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      id:[''],
      file: [''],
      currentImage: [''],
      link: ['', [Validators.required]],
    })
  }


  deleteValues(initialCar: ImageModel) {
    this._carService.deleteCar(initialCar.id).pipe(take(1)).subscribe({
      next: () => {
      const index = this.imageModel.findIndex(((p: { id: number; }) => p.id === initialCar.id));
      this._toastService.show('Car deleted successfully', { classname: 'bg-success text-light fs-2', delay: 3000 });
      if (index !== -1) {
        this.imageModel.splice(index, 1);
      }
     }
    })
  }

  getCarById(id: number) {
    console.log("what is this??");
    console.log(id);
    this._carService.getCarById(id).pipe(
      take(1),
      map(car => this._imageProcessingService.createImages(car))
      )
      .subscribe({
      next: (car:ImageModel) => {
        this.editForm.patchValue(car);
        console.log(car);
        // this.editForm.get('currentImage')?.setValue(car.carImage);
      }
    })
  }

  removeImage() {
    this.url = null;
    this.myInputVariable.nativeElement.value = '';
  }

  onFileSelectedToEdit(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.carForm.get('image')?.setValue(file);
    }
    console.log("we are getting  here3")
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target!.result;
      }
    }

    // const reader = new FileReader();

    // if (event.target.files && event.target.files.length) {
    //   const [file] = event.target.files;
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.editForm.patchValue({
    //       tso: reader.result
    //     });

        // need to run CD since file load runs outside of zone
        // this.cd.markForCheck();
      // }
    // }
  }
  
}
