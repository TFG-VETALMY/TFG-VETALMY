import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { InicioComponent } from './components/inicio/inicio';
import { Footer } from './components/footer/footer';
import { MiCuenta } from './components/mi-cuenta/mi-cuenta';
import { Consejos } from './components/consejos/consejos';
import { MisMascotas } from './components/mis-mascotas/mis-mascotas';
import { Citas } from './components/citas/citas';
import { Chat } from './components/chat/chat';
import { SobreNosotros } from './components/sobre-nosotros/sobre-nosotros';


export const routes: Routes = [
    // Esto es para que cuando ponga "/login" en el navegador, cargue el login
    { path: 'login', component: LoginComponent },

    // Esto es para el registro
    { path: 'registro', component: RegistroComponent },

    // Para el footer
    { path: 'footer', component: Footer },

    // Para la página de inicio
    { path: 'inicio', component: InicioComponent },

    // Para la página de Mi cuenta
    { path: 'mi-cuenta', component: MiCuenta },

    // Para la página de Consejos
    { path: 'consejos', component: Consejos },

    // Para la página de Mis mascotas
    { path: 'mis-mascotas', component: MisMascotas },

    // Para la página de Citas
    { path: 'citas', component: Citas },

    // Para la página de Chat
    { path: 'chat', component: Chat },

    // Para la página de Sobre nosotros 
    { path: 'sobre-nosotros', component: SobreNosotros },


    // Esto es para que me rediriga al login sin poner nada
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },

    // Para que si se escribe algo mal, vuelva al login
    { path: '**', redirectTo: '/inicio' },

];