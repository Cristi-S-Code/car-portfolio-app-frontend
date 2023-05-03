import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
declare var anime: any;              // declare like this

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
  
})
export class HomeComponent implements OnInit, AfterViewInit{

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
