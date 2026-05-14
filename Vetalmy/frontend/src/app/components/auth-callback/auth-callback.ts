import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-spinner">
        <div class="spinner-ring"></div>
        <p>Iniciando sesión con Google...</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #fdf8f4;
    }
    .callback-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .spinner-ring {
      width: 50px;
      height: 50px;
      border: 4px solid #e8d5b0;
      border-top-color: #b06e39;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    p {
      font-family: 'Rubik', sans-serif;
      color: #7a5c3e;
      font-size: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const { token, id, nombre, rol, email } = params;

      if (token && id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', id);
        localStorage.setItem('user_nombre', params['nombre'] ?? '');
        localStorage.setItem('user_role', params['rol'] ?? 'user');
        if (params['foto']) localStorage.setItem('user_foto', params['foto']);
        this.router.navigate(['/inicio']);
      } else {
        // Si no hay token, algo falló → vuelve al login
        this.router.navigate(['/login']);
      }
    });
  }
}
