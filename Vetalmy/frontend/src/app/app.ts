import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Menu } from './components/menu/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  constructor(public router: Router) { }
}



