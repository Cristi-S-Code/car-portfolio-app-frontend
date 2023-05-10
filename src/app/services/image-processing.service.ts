import { Injectable } from '@angular/core';
import { ImageModel } from '../models/image-model';
import { FileHandle } from '../models/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private _sanitizer: DomSanitizer) { }

  public createImages(image: ImageModel) {
    // @ts-ignore
    const carImage: any[] = image.carImage;

    const carImagesToFileHandle: FileHandle[] = [];

    for(let i = 0; i < carImage.length; i++){
      const imageFileData = carImage[i];

      const imageBlob = this.dataURItoBlob(imageFileData.picByte, imageFileData.type);

      const imageFile = new File([imageBlob], imageFileData.name, { type: imageFileData.type});

      const finalFileHandle: FileHandle = {
        file: imageFile,
        url: this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      }; 

      carImagesToFileHandle.push(finalFileHandle);
    }
    // @ts-ignore
    image.carImage = carImagesToFileHandle;
    return image;
  }

  public dataURItoBlob(picBytes: any, imageType: any) {
    const byteString = window.atob(picBytes);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Int8Array(arrayBuffer);

    for(let i = 0; i < byteString.length; i++) {
      int8Array[i] =  byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType});
    return blob;

  }
}
