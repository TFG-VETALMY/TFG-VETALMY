import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

// Imports de Primeng para la Nueva cita
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


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
  imports: [CommonModule, DatePickerModule, IftaLabelModule, FormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, FullCalendarModule, RouterLink, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})

export class Citas implements OnInit {

  // Para el Dialog
  visible: boolean = false;

  proximasCitas: any[] = [];
  historialCitas: any[] = [];
  mostrarHistorial: boolean = false;
  mascotas: any[] = [];
  veterinarios: any[] = [];
  mascotaSeleccionada: any;
  veterinarioSeleccionado: any;
  citaEditandoId: number | null = null;
  userRole: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  showDialog() {
    this.citaEditandoId = null;
    this.fechaCitaNueva = undefined;
    this.horaSeleccionada = undefined;
    this.tipoSeleccionado = undefined;
    this.mascotaSeleccionada = undefined;
    
    if (this.userRole === 'veterinario') {
      const currentUserId = Number(localStorage.getItem('user_id'));
      this.veterinarioSeleccionado = this.veterinarios.find(v => v.id === currentUserId);
    } else {
      this.veterinarioSeleccionado = undefined;
    }
    
    this.value = '';
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

  /** Todas las citas activas del sistema (sin filtrar por usuario) para bloqueo de horas */
  private todasLasCitasSistema: any[] = [];

  ngOnInit() {
    this.userRole = localStorage.getItem('user_role') || '';
    this.calendarOptions.editable = this.userRole === 'veterinario';

    this.tipos = [
      { name: 'Revisión', code: 'REV' },
      { name: 'Vacunación', code: 'VAC' },
      { name: 'Cirugía', code: 'CIR' },
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

    this.loadMascotas();
    this.loadVeterinarios();
    this.loadCitas();
  }

  loadMascotas() {
    const userId = Number(localStorage.getItem('user_id'));
    const userRole = localStorage.getItem('user_role');

    this.http.get<any[]>('/mascotas').subscribe({
      next: (mascotas) => {
        if (userRole === 'cliente') {
          // Mascotas del cliente
          this.mascotas = mascotas
            .filter(m => m.usuario?.id === userId || m.usuarioId === userId)
            .map(m => ({ ...m, displayLabel: m.nombre }));
        } else {
          // Veterinario o Admin pueden ver todas para asignar citas
          this.mascotas = mascotas.map(m => {
            const ownerName = m.usuario ? `${m.usuario.nombre} ${m.usuario.apellido1}` : 'Sin dueño';
            return {
              ...m,
              displayLabel: `${m.nombre} (Dueño: ${ownerName})`
            };
          });
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadVeterinarios() {
    this.http.get<any[]>('/usuarios').subscribe({
      next: (usuarios) => {
        this.veterinarios = usuarios.filter(u => u.rol === 'veterinario');
        this.cdr.detectChanges();
      }
    });
  }

  loadCitas() {
    const userId = Number(localStorage.getItem('user_id'));
    const userRole = localStorage.getItem('user_role');

    // Cargamos TODAS las citas del sistema para calcular disponibilidad de veterinarios
    this.http.get<any[]>('/citas').subscribe({
      next: (citas) => {
        // Guardamos TODAS las activas para el cálculo de bloqueo de horas
        this.todasLasCitasSistema = citas.filter(c => c.estado !== 'COMPLETADA');

        // Filtramos las que muestra la UI según el rol
        let citasFiltradas = citas;
        if (userRole === 'veterinario') {
          citasFiltradas = citas.filter(cita => cita.veterinario?.id === userId);
        } else if (userRole !== 'admin') {
          citasFiltradas = citas.filter(cita => cita.cliente?.id === userId);
        }

        const activas = citasFiltradas.filter(c => c.estado !== 'COMPLETADA');
        const completadas = citasFiltradas.filter(c => c.estado === 'COMPLETADA');

        this.proximasCitas = [...activas]
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .filter(cita => new Date(cita.fecha) >= new Date())
          .slice(0, 3);

        this.historialCitas = [...completadas]
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        // Guardamos todas las citas activas para acceder a ellas desde el eventClick
        this.todasLasCitas = activas;

        const calendarEvents = activas.map(cita => ({
          id: cita.id.toString(),
          title: cita.tipo ? `${cita.tipo} - ${cita.mascota?.nombre || 'Mascota'}` : `Cita - ${cita.mascota?.nombre || 'Mascota'}`,
          start: cita.fecha,
        }));

        this.calendarOptions = { ...this.calendarOptions, events: calendarEvents };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las citas', err);
      }
    });
  }

  onEventDrop(info: any) {
    const id = info.event.id;
    const newDate = info.event.start;

    this.http.patch(`/citas/${id}`, { fecha: newDate }).subscribe({
      next: () => {
        console.log(`Cita ${id} actualizada a la fecha ${newDate}`);
        this.loadCitas();
      },
      error: (err) => {
        console.error('Error al actualizar la cita', err);
        info.revert();
        this.cdr.detectChanges();
      }
    });
  }

  onFechaChange() {
    if (!this.fechaCitaNueva) return;

    const fechaSeleccionada = new Date(this.fechaCitaNueva);
    const hoy = new Date();
    const esHoy =
      fechaSeleccionada.getFullYear() === hoy.getFullYear() &&
      fechaSeleccionada.getMonth() === hoy.getMonth() &&
      fechaSeleccionada.getDate() === hoy.getDate();

    // Número total de veterinarios disponibles
    const totalVets = this.veterinarios.length;

    // Citas activas ese día concreto (de todo el sistema)
    const citasDia = this.todasLasCitasSistema.filter(c => {
      const fCita = new Date(c.fecha);
      return (
        fCita.getFullYear() === fechaSeleccionada.getFullYear() &&
        fCita.getMonth() === fechaSeleccionada.getMonth() &&
        fCita.getDate() === fechaSeleccionada.getDate()
      );
    });

    // Contamos cuántas citas hay por franja horaria exacta (HH:MM)
    const ocupacionPorHora: Record<string, Set<number>> = {};
    citasDia.forEach(c => {
      const fCita = new Date(c.fecha);
      const hh = fCita.getHours().toString().padStart(2, '0');
      const mm = fCita.getMinutes().toString().padStart(2, '0');
      const slot = `${hh}:${mm}`;
      if (!ocupacionPorHora[slot]) ocupacionPorHora[slot] = new Set();
      if (c.veterinario?.id) ocupacionPorHora[slot].add(c.veterinario.id);
    });

    // Si estamos editando una cita, excluímos esa cita del cálculo
    // (para que el propio slot de la cita editada no se bloquee)
    const idEditando = this.citaEditandoId;

    // Filtramos horas: eliminamos las pasadas (si es hoy) y las llenas de vets
    this.horasFiltradas = this.horasMaster.filter(slot => {
      // 1. Filtro por hora pasada si es hoy
      if (esHoy) {
        const [h, m] = slot.split(':').map(Number);
        const slotMinutos = h * 60 + m;
        const ahoraMinutos = hoy.getHours() * 60 + hoy.getMinutes();
        if (slotMinutos <= ahoraMinutos) return false;
      }

      // 2. Filtro de ocupación: si todos los vets están pillados en ese slot, bloqueamos
      if (totalVets > 0 && ocupacionPorHora[slot]) {
        const vetsOcupados = ocupacionPorHora[slot].size;
        // Si la cita que editamos ocupa este slot, no bloqueamos
        const citaEditandoEnSlot = idEditando
          ? citasDia.some(c => {
              const fCita = new Date(c.fecha);
              const hh = fCita.getHours().toString().padStart(2, '0');
              const mm = fCita.getMinutes().toString().padStart(2, '0');
              return `${hh}:${mm}` === slot && c.id === idEditando;
            })
          : false;

        if (!citaEditandoEnSlot && vetsOcupados >= totalVets) return false;
      }

      return true;
    });

    if (this.horaSeleccionada && !this.horasFiltradas.includes(this.horaSeleccionada)) {
      this.horaSeleccionada = undefined;
    }
    this.cdr.detectChanges();
  }

  modificarCita(cita: any) {
    this.citaEditandoId = cita.id;
    const fecha = new Date(cita.fecha);
    this.fechaCitaNueva = fecha;

    // Configurar la hora
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const horaFormat = hora < 10 ? `0${hora}` : `${hora}`;
    const minFormat = minutos < 10 ? `0${minutos}` : `${minutos}`;
    this.horaSeleccionada = `${horaFormat}:${minFormat}`;

    // Configurar el tipo
    this.tipoSeleccionado = this.tipos.find(t => t.name === cita.tipo);

    // Configurar la mascota y el veterinario (buscar en las listas cargadas)
    this.mascotaSeleccionada = this.mascotas.find(m => m.id === cita.mascota?.id);
    this.veterinarioSeleccionado = this.veterinarios.find(v => v.id === cita.veterinario?.id);

    this.value = cita.motivo || '';

    this.onFechaChange();

    this.visible = true;
    this.cdr.detectChanges();
  }

  cerrarDialogo() {
    this.visible = false;
    this.citaEditandoId = null;
    this.fechaCitaNueva = undefined;
    this.horaSeleccionada = undefined;
    this.tipoSeleccionado = undefined;
    this.mascotaSeleccionada = undefined;
    this.veterinarioSeleccionado = undefined;
    this.value = '';
    this.cdr.detectChanges();
  }

  cancelarCita(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.',
      header: 'Cancelar cita',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'Atrás',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.http.delete(`/citas/${id}`).subscribe({
          next: () => {
            this.loadCitas();
          },
          error: (err) => {
            console.error('Error al cancelar la cita', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al cancelar la cita' });
          }
        });
      }
    });
  }

  completarCita(id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de marcar esta cita como completada? Se moverá al historial.',
      header: 'Completar cita',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sí, completar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.http.patch(`/citas/${id}`, { estado: 'COMPLETADA' }).subscribe({
          next: () => {
            this.loadCitas();
          },
          error: (err) => {
            console.error('Error al completar la cita', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al completar la cita' });
          }
        });
      }
    });
  }

  guardarCita() {
    if (!this.fechaCitaNueva || !this.horaSeleccionada || !this.mascotaSeleccionada || !this.tipoSeleccionado) {
      this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Por favor, rellena todos los campos obligatorios (Fecha, Hora, Mascota y Tipo).' });
      return;
    }

    const [hora, min] = this.horaSeleccionada.split(':').map(Number);
    const fechaExacta = new Date(this.fechaCitaNueva);
    fechaExacta.setHours(hora, min, 0, 0);

    const userId = Number(localStorage.getItem('user_id'));
    const userRole = localStorage.getItem('user_role');

    // Determinamos de quién es la mascota
    const dueñoId = this.mascotaSeleccionada.usuario?.id || this.mascotaSeleccionada.usuarioId;

    const nuevaCita = {
      fecha: fechaExacta.toISOString(),
      tipo: this.tipoSeleccionado.name,
      motivo: this.value || '',
      mascotaId: this.mascotaSeleccionada.id,
      clienteId: userRole === 'cliente' ? userId : dueñoId,
      veterinarioId: this.veterinarioSeleccionado ? this.veterinarioSeleccionado.id : undefined
    };

    if (this.citaEditandoId) {
      this.http.patch(`/citas/${this.citaEditandoId}`, nuevaCita).subscribe({
        next: () => {
          this.cerrarDialogo();
          this.loadCitas();
        },
        error: (err) => {
          console.error('Error al actualizar la cita', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al actualizar la cita' });
        }
      });
    } else {
      this.http.post('/citas', nuevaCita).subscribe({
        next: () => {
          this.cerrarDialogo();
          this.loadCitas();
        },
        error: (err) => {
          console.error('Error al crear la cita', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al guardar la cita' });
        }
      });
    }
  }

  value: string = '';

  /** Almacena todas las citas activas para poder buscarlas al hacer click en el calendario */
  private todasLasCitas: any[] = [];

  onEventClick(info: any) {
    if (this.userRole !== 'veterinario') return;
    const id = Number(info.event.id);
    const cita = this.todasLasCitas.find(c => c.id === id);
    if (cita) {
      this.modificarCita(cita);
    }
  }

  toggleHistorial() {
    this.mostrarHistorial = !this.mostrarHistorial;
  }

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

    editable: true,
    eventDrop: this.onEventDrop.bind(this),
    eventClick: this.onEventClick.bind(this),
    events: []
  };
}