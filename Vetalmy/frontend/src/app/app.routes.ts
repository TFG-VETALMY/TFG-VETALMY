import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { InicioComponent } from './components/inicio/inicio';

export const routes: Routes = [
    // Esto es para que cuando ponga "/login" en el navegador, cargue el login
    { path: 'login', component: LoginComponent },
    // Esto es para el registro
    { path: 'registro', component: RegistroComponent },
    // Para la página de inicio
    { path: 'inicio', component: InicioComponent },

    // Esto es para que me rediriga al login sin poner nada
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },

    // Para que si se escribe algo mal, vuelva al login
    { path: '**', redirectTo: '/inicio' },

];