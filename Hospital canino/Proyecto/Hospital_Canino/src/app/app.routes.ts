import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { ReportComponent } from './Components/report/report.component';
import { ChatReportClientComponent } from './Components/chat-report-client/chat-report-client.component';
import { DetailsReportComponent } from './Components/details-report/details-report.component';
import { ChatReportAdminComponent } from './Components/chat-report-admin/chat-report-admin.component';
import { ReasonsForIncidentListComponent } from './Components/reasons-for-incident-list/reasons-for-incident-list.component';
import { AuthGuard } from './guards/auth.guard';
import { MedicamentosComponent } from './Components/medicamentos/medicamentos.component';
export const routes: Routes = [
  // Rutas Libres
  { path: 'Home', component: HomeComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Report', component: ReportComponent },
  { path: 'ChatReport', component: ChatReportClientComponent },
  // 🔒 Rutas Protegidas
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ReasonsForIncidentList',
    component: ReasonsForIncidentListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'DetailsReport',
    component: DetailsReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Chat',
    component: ChatReportAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Medicamentos',
    component: MedicamentosComponent,
    canActivate: [AuthGuard],
  },
  // Redirección por defecto
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  // Ruta comodín por si no existe
  { path: '**', redirectTo: 'Home' }
];
