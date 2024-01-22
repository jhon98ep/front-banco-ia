import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { CreditosComponent } from './creditos/creditos.component';
import { SolicitudesCreditosComponent } from './solicitudes-creditos/solicitudes-creditos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'creditos', component: CreditosComponent },
  { path: 'solicitudes', component: SolicitudesCreditosComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'login', component: LoginComponent },
  { path: '#', redirectTo: '/login', pathMatch: 'full'},
  { path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
