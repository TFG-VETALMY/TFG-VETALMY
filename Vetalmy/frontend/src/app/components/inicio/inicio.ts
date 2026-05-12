import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsejosCarruselComponent } from '../consejos-carrusel/consejos-carrusel';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ConsejosCarruselComponent, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {

}
