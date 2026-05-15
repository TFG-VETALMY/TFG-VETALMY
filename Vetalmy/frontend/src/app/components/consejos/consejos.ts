import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsejosCarruselComponent } from '../consejos-carrusel/consejos-carrusel';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

interface Consejo {
  titulo: string;
  detalle: string;
  imagen: string;
}

@Component({
  selector: 'app-consejos',
  standalone: true,
  imports: [CommonModule, ConsejosCarruselComponent, Tabs, TabList, Tab, TabPanel, TabPanels, CardModule, DialogModule],
  templateUrl: './consejos.html',
  styleUrl: './consejos.css'
})
export class Consejos {

  isMobile = window.innerWidth <= 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  displayDialog = false;
  consejoSeleccionado: Consejo | null = null;

  mostrarDetalle(consejo: Consejo) {
    if (this.isMobile) {
      this.consejoSeleccionado = consejo;
      this.displayDialog = true;
    }
  }

  consejosPerros: Consejo[] = [
    {
      titulo: 'Socialización temprana',
      imagen: 'imgs/Web/Consejos/Perros/cachorritos-jugando.jpg',
      detalle: 'Exponer a tu perro a diferentes personas, animales y entornos desde cachorro le ayudará a ser un adulto equilibrado y sin miedos. La etapa entre las 3 y las 12 semanas es la más crítica.'
    },
    {
      titulo: 'Ejercicio diario',
      imagen: 'imgs/Web/Consejos/Perros/perro-paseando.jpg',
      detalle: 'Los perros necesitan salir a pasear al menos dos o tres veces al día. El ejercicio regular previene problemas de conducta, obesidad y mejora su bienestar emocional.'
    },
    {
      titulo: 'Desparasitación regular',
      imagen: 'imgs/Web/Consejos/Perros/pulga.jpg',
      detalle: 'Mantén al día la desparasitación interna y externa de tu perro. Los parásitos como las pulgas, garrapatas y lombrices pueden afectar gravemente su salud y la de tu familia.'
    },
    {
      titulo: 'Cuida las plantas de tu hogar',
      imagen: 'imgs/Web/Consejos/Perros/perro-con-plantas.jpg',
      detalle: 'El potus, la difenbaquia o el lirio de paz son tóxicos para los perros. Colócalas fuera de su alcance o sustitúyelas por variedades seguras como la palmera areca.'
    },
    {
      titulo: 'Identifícalo con microchip',
      imagen: 'imgs/Web/Consejos/Perros/microchip.jpg',
      detalle: 'El microchip es obligatorio en España y es la forma más segura de identificar a tu perro si se pierde. Asegúrate de que sus datos estén actualizados en el registro correspondiente.'
    },
  ];

  consejosGatos: Consejo[] = [
    {
      titulo: 'Enriquecimiento ambiental',
      imagen: 'imgs/Web/Consejos/Gatos/gatito-con-rascador.jpg',
      detalle: 'Los gatos necesitan estímulos mentales y físicos. Rascadores, juguetes de caza y zonas elevadas donde subirse son esenciales para su bienestar dentro del hogar.'
    },
    {
      titulo: 'Bandeja de arena limpia',
      imagen: 'imgs/Web/Consejos/Gatos/caja-de-arena.jpg',
      detalle: 'Los gatos son muy limpios por naturaleza. Limpia la bandeja de arena a diario y cámbiala completamente cada semana para evitar que rechace usarla y desarrolle problemas de conducta.'
    },
    {
      titulo: 'Hidratación suficiente',
      imagen: 'imgs/Web/Consejos/Gatos/gato-bebiendo.jpg',
      detalle: 'Los gatos tienen poca sensación de sed. Coloca varios bebederos por la casa o considera una fuente de agua en movimiento para animarles a beber más y prevenir problemas renales.'
    },
    {
      titulo: 'Plantas tóxicas para gatos',
      imagen: 'imgs/Web/Consejos/gato-en-planta.jpg',
      detalle: 'El lirio, la flor de pascua, la hiedra y el aloe vera son peligrosos para los gatos. Revisa todas las plantas de tu hogar antes de traer un gato a casa.'
    },
    {
      titulo: 'Cuidado de las uñas',
      imagen: 'imgs/Web/Consejos/Gatos/zarpitas-gato.jpg',
      detalle: 'Corta las uñas de tu gato cada dos o tres semanas para evitar que se enganchen o crezcan en exceso. Proporciona rascadores para que pueda desgastarlas de forma natural.'
    },
  ];

  consejosParajaros: Consejo[] = [
    {
      titulo: 'Jaula espaciosa',
      imagen: 'imgs/Web/Consejos/Pájaros/jaula-pajaro.jpg',
      detalle: 'La jaula debe ser lo suficientemente grande para que el pájaro pueda extender las alas y moverse con libertad. Colócala en un lugar luminoso pero sin corrientes de aire ni sol directo constante.'
    },
    {
      titulo: 'Interacción diaria',
      imagen: 'imgs/Web/Consejos/Pájaros/pajarito-en-mano.jpg',
      detalle: 'Los pájaros son animales sociales que necesitan compañía. Dedícales tiempo fuera de la jaula cada día y háblales con frecuencia para evitar el estrés y fortalecer el vínculo.'
    },
    {
      titulo: 'Cuidado de las plumas',
      imagen: 'imgs/Web/Consejos/Pájaros/pajaro-baño.jpg',
      detalle: 'Ofrece un baño de agua tibia varias veces a la semana para que mantengan sus plumas limpias y en buen estado. El plumaje es un indicador clave de la salud del ave.'
    },
    {
      titulo: 'Temperatura estable',
      imagen: 'imgs/Web/Consejos/Pájaros/temperatura.jpg',
      detalle: 'Los pájaros son muy sensibles a los cambios bruscos de temperatura. Mantén la habitación entre 18 y 25 °C y aleja la jaula de ventanas, aires acondicionados y cocinas.'
    },
    {
      titulo: 'Juguetes y estimulación',
      imagen: 'imgs/Web/Consejos/Pájaros/pajaro-abaco.jpg',
      detalle: 'Proporciona juguetes variados dentro de la jaula: espejos, cuerdas, campanas y perchas de diferentes texturas. Rótales periódicamente para mantener la curiosidad y evitar el aburrimiento.'
    },
  ];

  consejosRoedores: Consejo[] = [
    {
      titulo: 'Espacio para explorar',
      imagen: 'imgs/Web/Consejos/Roedores/jaula-roedor.jpg',
      detalle: 'Los roedores necesitan jaulas amplias con materiales para excavar, escondites y ruedas de ejercicio. Un ambiente enriquecido reduce el estrés y previene comportamientos repetitivos.'
    },
    {
      titulo: 'Sustrato adecuado',
      imagen: 'imgs/Web/Consejos/Roedores/virutas-madera.jpg',
      detalle: 'Usa sustrato de papel prensado o viruta de madera sin tratar. Evita la viruta de pino o cedro, ya que sus aceites esenciales pueden causar problemas respiratorios en roedores pequeños.'
    },
    {
      titulo: 'Limpieza frecuente',
      imagen: 'imgs/Web/Consejos/Roedores/limpieza-jaulas.jpg',
      detalle: 'La jaula debe limpiarse al menos una vez a la semana para evitar la acumulación de bacterias y amoniaco. Cambia el sustrato regularmente y lava los comederos y bebederos con frecuencia.'
    },
    {
      titulo: 'Manipulación con cuidado',
      imagen: 'imgs/Web/Consejos/Roedores/hamster-con-mano.jpg',
      detalle: 'Los roedores son animales delicados. Acostúmbralos a tu presencia poco a poco y sin movimientos bruscos. Nunca los agarres por la cola y asegúrate de que se sientan seguros antes de cogerlos.'
    },
    {
      titulo: 'Compañía de su especie',
      imagen: 'imgs/Web/Consejos/Roedores/las-tres-ratitas.jpg',
      detalle: 'Muchos roedores como los ratones, las ratas y los cobayas son animales muy sociales y sufren si están solos. Infórmate sobre las necesidades sociales de tu especie antes de tener solo uno.'
    },
  ];
}