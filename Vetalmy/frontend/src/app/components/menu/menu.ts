import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para ngIf

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  isMenuOpen: boolean = false;

  constructor(private router: Router, private eRef: ElementRef) { }

  get isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (this.isMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.isMenuOpen = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
}