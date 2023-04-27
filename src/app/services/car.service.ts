import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '../models/car';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private readonly _baseUrl: string = 'http://localhost:8080';

  constructor(
    private _httpClient: HttpClient, 
    private _router: Router,
  ) { }

  createCar(car: Car): Observable<Car>{
    return this._httpClient.post(`${this._baseUrl}/cars/add`, car) as Observable<Car>;
  }  




}
