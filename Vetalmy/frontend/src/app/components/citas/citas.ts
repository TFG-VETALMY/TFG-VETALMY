import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports de FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas {

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

    // Lógica para cambiar la visualización según el tamaño de pantalla
    eventDisplay: 'block',

    events: [
      {
        title: 'Cita Médica 1',
        start: '2026-04-29',
        color: '#A67C52' // Aquí puedes poner directamente el valor de --marron-acento
      },
      {
        title: 'Cita Médica 2',
        start: '2026-04-29',
        color: '#A67C52'
      },
      {
        title: 'Vacunación',
        start: '2026-04-30',
        color: '#A67C52'
      }
    ]
  };
}