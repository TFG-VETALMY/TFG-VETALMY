import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importante para ngIf
import { Subscription } from 'rxjs';
import { UnreadMessagesService } from '../../services/unread-messages.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit, OnDestroy {
  isMenuOpen: boolean = false;
  mensajesSinLeer: number = 0;

  private unreadSub!: Subscription;

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private unreadSvc: UnreadMessagesService
  ) { }

  ngOnInit() {
    if (this.isLoggedIn) {
      this.unreadSvc.init();
      this.unreadSub = this.unreadSvc.unreadCount$.subscribe(count => {
        this.mensajesSinLeer = count;
      });
    }
  }

  ngOnDestroy() {
    this.unreadSub?.unsubscribe();
  }

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