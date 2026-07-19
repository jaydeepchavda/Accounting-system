import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/auth/components/login.component';
import { DashboardComponent } from './modules/dashboard/components/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'journals',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/journals/journals.module').then(m => m.JournalsModule)
  },
  {
    path: 'ledger',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/ledger/ledger.module').then(m => m.LedgerModule)
  },
  {
    path: 'trial-balance',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/ledger/ledger.module').then(m => m.LedgerModule)
  },
  {
    path: 'budgets',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/budgeting/budgeting.module').then(m => m.BudgetingModule)
  },
  {
    path: 'workflows',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/journals/journals.module').then(m => m.JournalsModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
