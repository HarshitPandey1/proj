import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { DoubtListComponent } from './components/doubt-list/doubt-list.component';
import { DoubtDetailComponent } from './components/doubt-detail/doubt-detail.component';
import { DoubtFormComponent } from './components/doubt-form/doubt-form.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'doubts', component: DoubtListComponent, canActivate: [AuthGuard] },
  { path: 'doubts/new', component: DoubtFormComponent, canActivate: [AuthGuard] },
  { path: 'doubts/:id', component: DoubtDetailComponent, canActivate: [AuthGuard] },
  { path: 'my-doubts', component: DoubtListComponent, canActivate: [AuthGuard], data: { myDoubts: true } },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
