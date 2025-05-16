import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { GetMedicamentsService } from '../../Services/getMedicaments.service';
import { GetIncidetsServices } from '../../Services/getIncidents.service';
import { GetPrioridadIncidents } from '../../Services/getPrioridadesIncidents.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MedicamentsModel } from '../../Interfaces/MedicamentsModel';
import { PrioridadesIncidentsModel } from '../../Interfaces/PrioridadesIncidentsModel';
import { IncidentsModel } from '../../Interfaces/incideciasModel';
import { Subject, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
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
  isLoading: boolean = false;
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
    tipo: '',
  };
  incidentsInRevisionFilter: IncidentsModel[] = [];
  incidentsInPendingFilter: IncidentsModel[] = [];
  incidentsInDoneFilter: IncidentsModel[] = [];
  incidentsInFactWithoutAnswerFilter: IncidentsModel[] = [];
  isActivateFilter = false;
  ngOnInit() {
    this.isLoading = true;
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
    this.isLoading = false;
    //
  }
  // Obtenemos todos los medicamentos
  getMedicaments() {
    this.medicamentsService
      .getMedicaments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.medicamentsWithOutStock = [];
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
    console.log("se obtienen las incidencias");
      this.incidentsService.checkAndUpdateStatuses().then(() => {
      this.getAllInicidets();
    }).catch(error => {
      console.error('Error al actualizar incidencias:', error);
      this.createErrorAlert("Error al actualizar incidencias");
      this.getAllInicidets();
    });
  }
  getAllInicidets() {
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
  // Obtenermos todos los tipos de prioridades
  getPrioridadIncidents() {
    this.prioridatIncidents
      .getControlIncidencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.prioridadIncidents = data;
        this.prioridadIncidents.sort((a, b) => a.name.localeCompare(b.name));
      });
  }
  // filters
  // se convierte el formato de fecha al deseado
  formatearFecha(fechaISO: string): string {
    const [anio, mes, dia] = fechaISO.split('-');
    const meses = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const mesTexto = meses[parseInt(mes, 10) - 1];
    return `${dia}/${mesTexto}/${anio}`;
  }
  filterArray(fecha: string, tipo: string) {
    var fechaFormateada = this.formatearFecha(fecha);
    switch (this.isOpen) {
      case 'revision':
        if (fechaFormateada != '' && tipo != '') {
          this.incidentsInRevisionFilter = this.incidentsInRevision.filter(
            (incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideFecha && coincideTipo;
            }
          );
        } else if (fechaFormateada != '') {
          this.incidentsInRevisionFilter = this.incidentsInRevision.filter(
            (incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              return coincideFecha;
            }
          );
        } else if (tipo != '') {
          this.incidentsInRevisionFilter = this.incidentsInRevision.filter(
            (incidente) => {
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideTipo;
            }
          );
        } else {
          this.incidentsInRevisionFilter = this.incidentsInRevision;
        }
        break;
      case 'pendientes':
        if (fechaFormateada != '' && tipo != '') {
          this.incidentsInPendingFilter = this.incidentsInPending.filter(
            (incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideFecha && coincideTipo;
            }
          );
        } else if (fechaFormateada != '') {
          this.incidentsInPendingFilter = this.incidentsInPending.filter(
            (incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              return coincideFecha;
            }
          );
        } else if (fechaFormateada != '') {
          this.incidentsInPendingFilter = this.incidentsInPending.filter(
            (incidente) => {
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideTipo;
            }
          );
        } else {
          this.incidentsInPendingFilter = this.incidentsInPending;
        }
        break;
      case 'cerrados':
        if (fechaFormateada != '' && tipo != '') {
          this.incidentsInDoneFilter = this.incidentsInDone.filter(
            (incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideFecha && coincideTipo;
            }
          );
        } else if (fechaFormateada != '') {
          this.incidentsInDoneFilter = this.incidentsInDone.filter(
            (incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              return coincideFecha;
            }
          );
        } else if (tipo != '') {
          this.incidentsInDoneFilter = this.incidentsInDone.filter(
            (incidente) => {
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideTipo;
            }
          );
        } else {
          this.incidentsInDoneFilter = this.incidentsInDone;
        }
        break;
      case 'cerradosSinContestacion':
        if (fechaFormateada != '' && tipo != '') {
          this.incidentsInFactWithoutAnswerFilter =
            this.incidentsInFactWithoutAnswer.filter((incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideFecha && coincideTipo;
            });
        } else if (fechaFormateada != '') {
          this.incidentsInFactWithoutAnswerFilter =
            this.incidentsInFactWithoutAnswer.filter((incidente) => {
              const coincideFecha = this.filters.fecha
                ? incidente.date === fechaFormateada
                : true;
              return coincideFecha;
            });
        } else if (tipo != '') {
          this.incidentsInFactWithoutAnswerFilter =
            this.incidentsInFactWithoutAnswer.filter((incidente) => {
              const coincideTipo = this.filters.tipo
                ? incidente.prioridad === this.filters.tipo
                : true;
              return coincideTipo;
            });
        } else {
          this.incidentsInFactWithoutAnswerFilter =
            this.incidentsInFactWithoutAnswer;
        }
        break;
    }
  }
  clearFilter() {
    this.filters.fecha = '';
    this.filters.tipo = '';
    this.filterArray('', '');
    this.isActivateFilter = false;
  }
  // animacion de campana
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
  toggleOpenSeccions(
    panel: 'revision' | 'pendientes' | 'cerrados' | 'cerradosSinContestacion'
  ) {
    this.isActivateFilter = false;
    this.clearFilter();
    this.isOpen = this.isOpen === panel ? null : panel;
    this.filterArray('', '');
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
  goToDetails(index: number) {
    var dataSelect: IncidentsModel | undefined;
    switch (this.isOpen) {
      case 'revision':
        dataSelect = this.incidentsInRevisionFilter[index];
        break;
      case 'pendientes':
        dataSelect = this.incidentsInPendingFilter[index];
        break;
      case 'cerrados':
        dataSelect = this.incidentsInDoneFilter[index];
        break;
      case 'cerradosSinContestacion':
        dataSelect = this.incidentsInFactWithoutAnswerFilter[index];
        break;
    }
    if (dataSelect == undefined) {
      this.createErrorAlert("Error al obtener el detalle de la incidencia.")
    } else {
      this.router.navigate(['DetailsReport'], {
        queryParams: {
          incidencia: JSON.stringify(dataSelect)
        }
      });
    }
  }
  toggIncident() {
    this.router.navigate(['ReasonsForIncidentList']);
  }
  tapGenerateReport() {
    if (this.filters.fecha != '' && this.filters.tipo != '') {
      this.isActivateFilter = true
    } else if (this.filters.fecha != '') {
      this.isActivateFilter = true
    } else if (this.filters.tipo != '') {
      this.isActivateFilter = true 
    } else {
      this.isActivateFilter = false
    }
    switch (this.isOpen) {
      case 'revision':
       if (this.isActivateFilter) {
        this.createSuccessAlert('¿Quieres generar el excel con el filtro o sin filtro?')
       } else {
        this.exportarExcel(this.incidentsInRevision, 'EnRevisión');
       }
        break;
      case 'pendientes':
        if (this.isActivateFilter) {
          this.createSuccessAlert('¿Quieres generar el excel con el filtro o sin filtro?')
         } else {
          this.exportarExcel(this.incidentsInPending, 'Pendientes');
         }
        break;
      case 'cerrados':
        if (this.isActivateFilter) {
          this.createSuccessAlert('¿Quieres generar el excel con el filtro o sin filtro?')
         } else {
          this.exportarExcel(this.incidentsInDone, 'Cerrados');
         }
        break;
      case 'cerradosSinContestacion':
        if (this.isActivateFilter) {
          this.createSuccessAlert('¿Quieres generar el excel con el filtro o sin filtro?')
         } else {
          this.exportarExcel(this.incidentsInFactWithoutAnswer, 'CerradosSinContestación');
         }
        break;
    }
  }
  createSuccessAlert(message: string, ) {
    Swal.fire({
      icon: 'info',
      html: message,
      showCloseButton: true,
      showCancelButton: this.isActivateFilter,
      confirmButtonColor: '#0e2b53',
      cancelButtonColor: '#0e2b53',
      focusConfirm: false,
      confirmButtonText: this.isActivateFilter ? 'Con filtro' : 'Generar reporte',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: 'Sin filtro',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.isConfirmed) {
        switch (this.isOpen) {
          case 'revision':
            this.exportarExcel(this.incidentsInRevisionFilter, 'EnRevisión');
            break;
          case 'pendientes':
            this.exportarExcel(this.incidentsInPendingFilter, 'Pendientes');
            break;
          case 'cerrados':
            this.exportarExcel(this.incidentsInDoneFilter, 'Cerrados');
            break;
          case 'cerradosSinContestacion':
            this.exportarExcel(this.incidentsInFactWithoutAnswerFilter, 'CerradosSinContestación');
            break;
        }
      } else if (result.isDenied) {
        switch (this.isOpen) {
          case 'revision':
            this.exportarExcel(this.incidentsInRevision, 'EnRevisión');
            break;
          case 'pendientes':
            this.exportarExcel(this.incidentsInPending, 'Pendientes');
            break;
          case 'cerrados':
            this.exportarExcel(this.incidentsInDone, 'Cerrados');
            break;
          case 'cerradosSinContestacion':
            this.exportarExcel(this.incidentsInFactWithoutAnswer, 'CerradosSinContestación');
            break;
        }
      }
    });
  }
  exportarExcel(data: IncidentsModel[], titleHojaExcel: string): void {
    if (!data || data.length === 0) {
      console.warn('No hay datos para exportar');
      this.createErrorAlert('No hay datos para exportar')
      return;
    }
    const datosSinCreatedAt = data.map(({ createdAt, ...resto }) => resto);
    const hojaDeTrabajo = XLSX.utils.json_to_sheet(datosSinCreatedAt);
    const libroDeTrabajo: XLSX.WorkBook = {
      Sheets: { [titleHojaExcel]: hojaDeTrabajo },
      SheetNames: [titleHojaExcel],
    };
    const excelBuffer: any = XLSX.write(libroDeTrabajo, {
      bookType: 'xlsx',
      type: 'array',
    });
    const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const nombreArchivo = `${titleHojaExcel}_${fecha}.xlsx`;
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(blob, nombreArchivo);
  }  
  // alerta de error
    createErrorAlert(message: string) {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un error...',
        text: message,
        confirmButtonColor: "#0e2b53",
      });
    }
}
