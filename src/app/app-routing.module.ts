import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'order', pathMatch: 'full'},
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'product',
        loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'order',
        loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule),
      },
    ]
  },
  {path: 'login', component: LoginComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
