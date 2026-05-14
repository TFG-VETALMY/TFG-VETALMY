import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, BadgeModule, ButtonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios {
  
}