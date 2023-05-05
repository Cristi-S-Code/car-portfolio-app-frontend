import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
declare var anime: any;              // declare like this

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
  
})
export class HomeComponent implements OnInit, AfterViewInit{

  expand=false;counter = 0;
  
  constructor(
    private _splashScreenStateService: SplashScreenStateService,
    private _activatedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit()  {
    this._splashScreenStateService.stop();
  //   setTimeout(() => {
  //     this._splashScreenStateService.stop();
  //  }, 1900);
  }

  mouseup(){
    return this.counter++;
   }

  @HostListener('document:click', ['$event'])
  onClick($event: any) {
     this.expand=true;
    //  this.expand=false;
    //  this.releaseMouse($event);
    //  setTimeout(() => {
    //   this.expand=false;
    //  }, 500)
 }
//  onClick($event:any) {

//  }
  @HostListener('document:close', ['$event'])
  onmouseup($event: any) {
    this.expand = false;
  }

  // releaseMouse($event: any) {
  //     return  this.expand=false;
  // }

  @ViewChild('cursor') refCursor:any;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) { 
      // console.log('width' + event.pageX);
      // console.log('height' + event.pageY);
      this.refCursor.nativeElement.style.left = event.pageX + "px";
      this.refCursor.nativeElement.style.top = event.pageY + "px";
      
  }

  ngAfterViewInit(): void {
    // Wrap every letter in a span
const textWrapper = document.querySelector('.an-1');
textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({})
.add({
  targets: '.an-1 .letter',
  scale: [4,1],
  opacity: [0,1],
  translateZ: 0,
  easing: "easeOutExpo",
  duration: 2100,
  loop: true,
  delay: (el: any, i: number) => 70*i
});
}

}
