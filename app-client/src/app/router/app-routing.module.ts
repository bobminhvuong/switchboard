import { SwitchboardComponent } from './../container/switchboard/switchboard.component';
import { LoginComponent } from './../login/login.component';
import { CanActivateService } from './../service/auth/can-activate.service';
import { DashboardComponent } from './../container/dashboard/dashboard.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '../container/main/main.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'manager', component: MainComponent, canActivate: [CanActivateService], children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'switchboard', component: SwitchboardComponent },
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes, { useHash: true })
    ]
})
export class AppRoutingModule { }
