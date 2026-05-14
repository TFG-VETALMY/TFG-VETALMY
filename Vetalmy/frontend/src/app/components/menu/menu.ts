import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  avatarMenuOpen: boolean = false;
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

  get userInicial(): string {
    const nombre = localStorage.getItem('user_nombre') ?? '';
    return nombre.charAt(0).toUpperCase() || '?';
  }

  get userNombre(): string {
    return localStorage.getItem('user_nombre') ?? 'Usuario';
  }

  get userFoto(): string {
    return localStorage.getItem('user_foto') ?? '';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.avatarMenuOpen = false;
  }

  toggleAvatarMenu(event: MouseEvent) {
    event.stopPropagation();
    this.avatarMenuOpen = !this.avatarMenuOpen;
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      this.avatarMenuOpen = false;
    }
  }

  logout() {
    this.isMenuOpen = false;
    this.avatarMenuOpen = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_nombre');
    this.router.navigate(['/login']);
  }

  navegarA(ruta: string) {
    this.avatarMenuOpen = false;
    this.router.navigate([ruta]);
  }
}