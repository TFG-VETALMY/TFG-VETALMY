import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';

export const routes: Routes = [
    // Esto es para que cuando ponga "/login" en el navegador, cargue el login
    { path: 'login', component: LoginComponent },
    // Esto es para el registro
    { path: 'registro', component: RegistroComponent },

    // Esto es para que me rediriga al login sin poner nada
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Para que si se escribe algo mal, vuelva al login
    { path: '**', redirectTo: '/login' }

];