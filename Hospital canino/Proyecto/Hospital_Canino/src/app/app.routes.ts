import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
export const routes: Routes = [
    // se declaran las rutas
    { path: 'Home', component: HomeComponent },
    { path: 'Dashboard', component: DashboardComponent },
    { path: '', redirectTo: 'Home', pathMatch: 'full'}
];
