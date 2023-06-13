import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCarousel, NgbModal, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, map, take, throwError } from 'rxjs';
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
  url: any = null;
  urlToEdit: any;
  urlHolder: any;
  isLoogedIn: boolean = false;
  isLoogedOut: boolean = true;
  selectedFile: any;

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
      console.log(newCar);
      
    this._createCar(newCar); //de adaugat si cond pt update later
    //  !! this.selectedCar ? this._updateCar(newCar) : this._createCar(newCar);
      // this.resetForm()

    }

  private _createCar(newCar: Car) {
    console.log("we are getting  here2")
    console.log("This is the new car tryng to create ===>", newCar)
    
      const carFormData = this.prepareFormData(newCar);
      console.log("This is the new formdata tryng to create ===>", carFormData)
      this._carService.createCar(carFormData).pipe(take(1)).subscribe({
        next: () => {
          // console.log("This is the new car created ===>", newCar),
          this.resetForm();
          this.url = null;
          this.imageModel.push(carFormData);
          // this._router.navigate(this.imageModel.slice(-1));
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


  updateValues(item: any) {
    const carId = this.editForm.get('id')?.setValue(item.id);
    // const carId = item.id;
    console.log(carId);
    
    const descriptionValue = this.editForm.get('description')?.value;
    const linkValue = this.editForm.get('link')?.value;
    // const carImageControl = this.editForm.get('carImage') as FormControl;
    // const carImageFile = carImageControl?.value;
    // console.log('Description:', descriptionValue);
    console.log("what is this");
    console.log(item.carImage);
    
    console.log(typeof item.carImage);
    
  
      const editedCar: ImageModel = {
        id: carId,
        description: descriptionValue,
        link: linkValue,
        ...this.editForm.getRawValue(),
        carImage: item.carImage[0].file as File

        // carImage: selectedFile
      };

      console.log(editedCar.carImage);
      
      console.log("this is edited car --->",editedCar);
      // console.log(typeof editedCar.carImage);
      console.log("carImage type:", editedCar.carImage instanceof File);
      
      this._updateCar(editedCar);
      
  }

  private _updateCar(editedCar: ImageModel) {
    const carFormData = this.prepareFormData2(editedCar);
    console.log("this is formdata");
    
    console.log(carFormData);
    
    this._carService.updateCar(carFormData).pipe(take(1)).subscribe({
      next: () => {
        this._toastService.show('Car added successfully', { classname: 'bg-primary text-light fs-2', delay: 3000 });
      },
      error: () => alert('Object was not updated. Call your IT responsable!')
    })
  }

  

  prepareFormData(car: Car): FormData {
    const formData = new FormData;

    formData.append(
      'newCar',
      new Blob([JSON.stringify(car)], {type: 'application/json'})
    );
      console.log("this is carimage", car.image);
      
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

  prepareFormData2(car: ImageModel): FormData {
    const formData2 = new FormData;
    const carImageFileOnly = car.carImage;
    console.log(typeof car.carImage);
    
    console.log("preparing things", carImageFileOnly);
    
    formData2.set(
      'editedCar',
      new Blob([JSON.stringify(car)], {type: 'application/json'})
    );
      console.log("this is carimage", car.carImage.name);
      
    formData2.set(
      'imageFile',
      carImageFileOnly,
      carImageFileOnly.name
    )  

    return formData2;
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
      carImage: [''],
      // currentImage: [''],
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
      // map(car => this._imageProcessingService.createImages(car))
      )
      .subscribe({
      next: (car:ImageModel) => {
        // this.editForm.get('carImage')?.setValue('');
        // this.editForm.patchValue(car);
        this.editForm.get('description')?.setValue(car.description);
        this.editForm.get('link')?.setValue(car.link);
        console.log(car);
      }
    })
  }

  removeImage() {
    this.url = null;
    this.myInputVariable.nativeElement.value = '';
  }

  onFileSelectedToEdit(event: any) {

  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const reader: FileReader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const fileContent: string = e.target.result;
  //     // Process the file content here
  //     this.carForm.get('carImage')?.setValue(fileContent);
  //     this.url = e.target!.result;
  //   };
  //   reader.readAsDataURL(file);
  //   console.log("qvq", file);
    
  // }

    // goof code
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.carForm.get('carImage')?.setValue(file);
    }
    console.log("we are getting  here3", event.target.files)
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = event.target!.result;
      }      
    }
    //goof code until here

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


