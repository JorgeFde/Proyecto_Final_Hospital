import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { GetMedicamentsService } from '../../Services/getMedicaments.service';
import { GetIncidetsServices } from '../../Services/getIncidents.service';
import { GetPrioridadIncidents } from '../../Services/GetPrioridadesIncidents.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MedicamentsModel } from '../../Interfaces/MedicamentsModel';
import { PrioridadesIncidentsModel } from '../../Interfaces/PrioridadesIncidentsModel';
import { IncidentsModel } from '../../Interfaces/incideciasModel';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbar,
    NgIf,
    FormsModule,
    NgClass,
    NgFor,
    NotificationsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private incidentsService: GetIncidetsServices,
    private medicamentsService: GetMedicamentsService,
    private prioridatIncidents: GetPrioridadIncidents
  ) {}
  // Esto se agrega para ocupar las rutas
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  private hasLoadedIncidents = false;
  isOpen:
    | 'revision'
    | 'pendientes'
    | 'cerrados'
    | 'cerradosSinContestacion'
    | null = null;
  panelVisible: boolean = false;
  isNotification: boolean = false;
  isActiveAnimation: boolean = false;
  intervalId: any;
  bellAnimating: boolean = false;
  indexMotivoSelect: number = -1;
  medicamentsWithOutStock: MedicamentsModel[] = [];
  prioridadIncidents: PrioridadesIncidentsModel[] = [];
  // arreglos del incidencia
  dataIncident: IncidentsModel[] = [];
  incidentsInRevision: IncidentsModel[] = [];
  incidentsInPending: IncidentsModel[] = [];
  incidentsInDone: IncidentsModel[] = [];
  incidentsInFactWithoutAnswer: IncidentsModel[] = [];
  // filtros
  filters = {
    fecha: '',
    hora: '',
    tipo: ''
  }; 

  ngOnInit() {
    this.setConfigUI();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.intervalId);
  }
  resetArray() {
    this.medicamentsWithOutStock = [];
    this.dataIncident = [];
    this.prioridadIncidents = [];
    this.incidentsInRevision = [];
    this.incidentsInPending = [];
    this.incidentsInDone = [];
    this.incidentsInFactWithoutAnswer = [];
  }
  setConfigUI() {
    //Llamada a la base de datos
    this.getMedicaments();
    this.getPrioridadIncidents();
    this.getIncidents();
    //
  }
  // Obtenemos todos los medicamentos
  getMedicaments() {
    this.medicamentsService
      .getMedicaments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].stock <= 10) {
            this.medicamentsWithOutStock.push(data[i]);
          }
        }
        this.isNotification = this.medicamentsWithOutStock.length != 0;
        this.setupNotificationAnimationLoop();
      });
  }
  // Obtenemos todas las incidencias
  getIncidents() {
    if (this.hasLoadedIncidents) return;
    this.hasLoadedIncidents = true;
    this.incidentsService
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.incidentsInRevision = [];
        this.incidentsInPending = [];
        this.incidentsInDone = [];
        this.incidentsInFactWithoutAnswer = [];
        this.dataIncident = data;
        for (let i = 0; i < data.length; i++) {
          switch (data[i].status) {
            case 'En revision':
              this.incidentsInRevision.push(data[i]);
              break;
            case 'Pendiente':
              this.incidentsInPending.push(data[i]);
              break;
            case 'Cerrado':
              this.incidentsInDone.push(data[i]);
              break;
            case 'Cerrado sin contestación':
              this.incidentsInFactWithoutAnswer.push(data[i]);
              break;
          }
        }
      });
  }
  // Obtenermos todos los motivos
  getPrioridadIncidents() {
    this.prioridatIncidents
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.prioridadIncidents = data;
        this.prioridadIncidents.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  // aniacion de camapana
  setupNotificationAnimationLoop() {
    if (this.isNotification) {
      this.triggerShake();

      this.intervalId = setInterval(() => {
        if (this.isNotification) {
          this.triggerShake();
        }
      }, 1 * 60 * 1000); // cada 1 minutos
    }
  }
  // filters
  onMotivoChange(fecha: string, hora: string, tipo: string) {
    console.log('Fecha:', fecha);
    console.log('Hora:', hora);
    console.log('Tipo:', tipo);
    // Aquí puedes aplicar tu lógica de filtrado
  }
  clearFilter() {
    this.filters.fecha = ''
    this.filters.tipo = ''
    this.onMotivoChange('', '', '');
  }
  triggerShake() {
    // activa animación
    this.bellAnimating = true;
    // detiene animación después de 2 segundos
    setTimeout(() => {
      this.bellAnimating = false;
    }, 2000);
  }
  // termina animacion de campana
  // botones
  toggle(
    panel: 'revision' | 'pendientes' | 'cerrados' | 'cerradosSinContestacion'
  ) {
    this.indexMotivoSelect = -1;
    this.isOpen = this.isOpen === panel ? null : panel;
  }
  // panel de notificaciones
  togglePanel() {
    this.panelVisible = !this.panelVisible;
  }
  // cerrar sesion
  toggleLogOut() {
    this.alertLogOut();
  }
  alertLogOut() {
    Swal.fire({
      icon: 'info',
      html: '¿ Estas seguro que deseas cerrar sesión ?',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#0e2b53',
      cancelButtonColor: '#fa0202',
      focusConfirm: false,
      confirmButtonText: 'Cerrar sesión',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: 'Cancelar',
      cancelButtonAriaLabel: 'Thumbs down',
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetArray();
        this.authService.logout();
      }
    });
  }
  // Go To Details
  goToDetails() {
    this.router.navigate(['DetailsReport']);
  }
  toggIncident() {
    this.router.navigate(['ReasonsForIncidentList']);
  }
}
