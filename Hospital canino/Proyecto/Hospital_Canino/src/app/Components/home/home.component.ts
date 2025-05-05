import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-home',
  imports: [MatToolbar, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('1s ease-in-out')),
    ])
  ]
})
export class HomeComponent {
  // arreglo de imagenes para animaciones con textos
  images = [
    { src: 'assets/images/banner1.jpg', text: 'QUIRÓFANO' },
    { src: 'assets/images/banner2.jpg', text: 'CARDIOLOGIA' },
    { src: 'assets/images/banner3.jpg', text: 'LABORATORIO' }
  ];
  imagesSponsors: string[] = [
    'assets/IMGSponsors/sponsor1.webp',
    'assets/IMGSponsors/sponsor2.png',
    'assets/IMGSponsors/sponsor3.webp',
    'assets/IMGSponsors/sponsor4.png',
    'assets/IMGSponsors/sponsor5.png',
    'assets/IMGSponsors/sponsor6.webp',
    'assets/IMGSponsors/sponsor7.webp'
  ];
  currentIndex = 0;
  animationState: 'visible' | 'hidden' = 'visible';
  ngOnInit() {
    this.startLoop();
  }
  // funcion para loop de animacion
  startLoop() {
    setInterval(() => {
      this.animationState = 'hidden';
      // Espera a que termine la animación de salida para cambiar de imagen
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.animationState = 'visible';
      }, 700); // mismo tiempo que la animación (1s)
    }, 6000); // duración total por imagen (2s visible + 1s fade)
  }
}
