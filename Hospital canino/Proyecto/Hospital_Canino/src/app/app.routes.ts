import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { ReportComponent } from './Components/report/report.component';
import { ChatReportClientComponent } from './Components/chat-report-client/chat-report-client.component';
import { DetailsReportComponent } from './Components/details-report/details-report.component';
import { ChatReportAdminComponent } from './Components/chat-report-admin/chat-report-admin.component';
export const routes: Routes = [
    // se declaran las rutas
    { path: 'Home', component: HomeComponent },
    { path: 'Login', component: LoginComponent },
    { path: 'Report', component: ReportComponent },
    { path: 'ChatReport', component: ChatReportClientComponent },
    { path: 'Dashboard', component: DashboardComponent },
    { path: 'DetailsReport', component: DetailsReportComponent },
    { path: 'Chat', component: ChatReportAdminComponent },
    { path: '', redirectTo: 'Home', pathMatch: 'full'}
];
