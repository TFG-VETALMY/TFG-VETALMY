import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsejosCarruselComponent } from '../consejos-carrusel/consejos-carrusel';

@Component({
  selector: 'app-inicio',
  imports: [ConsejosCarruselComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {

}
