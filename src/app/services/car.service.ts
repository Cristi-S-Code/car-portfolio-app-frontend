import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '../models/car';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/image-model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private readonly _baseUrl: string = 'http://localhost:8080';

  constructor(
    private _httpClient: HttpClient, 
    private _router: Router,
  ) { }

  createCar(car: FormData): Observable<Car>{
    return this._httpClient.post(`${this._baseUrl}/cars/add`, car) as Observable<Car>;
  }  

  // getAllCars(): Observable<Car[]>{
  //   return this._httpClient.get(`${this._baseUrl}/cars`) as Observable<Car[]>;
  // }

  getAllCars(): Observable<ImageModel[]>{
    return this._httpClient.get(`${this._baseUrl}/cars`) as Observable<ImageModel[]>;
  }

  deleteCar(id: number): Observable<ImageModel>{
    return this._httpClient.delete(`${this._baseUrl}/cars/delete/${id}`) as Observable<ImageModel>;
  }

  getCarById(id: number): Observable<ImageModel>{
    return this._httpClient.get(`${this._baseUrl}/cars/edit/${id}`) as Observable<ImageModel>;
  }
}
