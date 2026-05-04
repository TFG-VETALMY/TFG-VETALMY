import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Imports de Primeng para la Nueva cita
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';


// Imports de FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';

interface Tipo {
  name: string;
  code: string;
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, DatePickerModule, IftaLabelModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, FullCalendarModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})

export class Citas {

  // Para el Dialog
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  // Para el select de la fecha y el de la hora
  horasMaster: string[] = [];
  horasFiltradas: string[] = [];

  // Para la fecha
  fechaCitaNueva: Date | undefined;

  // Para el select de la fecha
  tipos: Tipo[] = [];
  tipoSeleccionado: Tipo | undefined;
  fechaSeleccionada: Date | undefined;
  motivoCita: string = '';

  fechaActual: Date = new Date();

  // Para el select de la hora
  horas: string[] = [];
  horaSeleccionada: string | undefined;

  ngOnInit() {
    this.tipos = [
      { name: 'Revisión', code: 'REV' },
      { name: 'Vacunación', code: 'VAC' },
      { name: 'Cirugía', code: 'CIR' }, // Corregido "Cirujía" a "Cirugía" ;)
      { name: 'Urgencia', code: 'URG' }
    ];

    // 1. Llenamos las horas en horasMaster
    const listaHoras = [];
    for (let h = 9; h <= 20; h++) {
      const horaFormateada = h < 10 ? `0${h}` : `${h}`;
      listaHoras.push(`${horaFormateada}:00`);
      listaHoras.push(`${horaFormateada}:30`);
    }
    this.horasMaster = listaHoras;

    // 2. Inicializamos horasFiltradas con todas las horas por defecto
    this.horasFiltradas = [...this.horasMaster];
  }

  onFechaChange() {
    if (!this.fechaCitaNueva) return;

    const hoy = new Date();
    // Comparamos si la fecha seleccionada es hoy (sin importar la hora)
    const esHoy = this.fechaCitaNueva.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

    if (esHoy) {
      // Calculamos los minutos transcurridos hoy
      const ahoraEnMinutos = hoy.getHours() * 60 + hoy.getMinutes();

      this.horasFiltradas = this.horasMaster.filter(h => {
        const [hora, min] = h.split(':').map(Number);
        const tiempoCitaEnMinutos = hora * 60 + min;
        // Solo permitimos citas con al menos 15-30 min de margen si quieres, 
        // o simplemente mayores a la hora actual:
        return tiempoCitaEnMinutos > ahoraEnMinutos;
      });
    } else {
      this.horasFiltradas = [...this.horasMaster];
    }

    // Limpiamos la selección si la hora ya no es válida
    if (this.horaSeleccionada && !this.horasFiltradas.includes(this.horaSeleccionada)) {
      this.horaSeleccionada = undefined;
    }
  }

  // Para el motivo
  value: string = '';

  // Para el Fullcalendar
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: esLocale,
    firstDay: 1,

    dayMaxEvents: true,

    eventDisplay: 'block',

    eventColor: 'var(--marron-acento)',

    events: [
      {
        title: 'Cita Médica 1',
        start: '2026-04-29',
      },
      {
        title: 'Cita Médica 2',
        start: '2026-04-29',
      },
      {
        title: 'Vacunación',
        start: '2026-04-30',
      }
    ]
  };
}