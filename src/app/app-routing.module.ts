import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { CreditosComponent } from './creditos/creditos.component';
import { SolicitudesCreditosComponent } from './solicitudes-creditos/solicitudes-creditos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { UsuariosVerComponent } from './usuarios-ver/usuarios-ver.component';
import { SolicitudesVerComponent } from './solicitudes-ver/solicitudes-ver.component';


const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'creditos', component: CreditosComponent },
  { path: 'solicitudes', component: SolicitudesCreditosComponent },
  { path: 'solicitud/:id', component: SolicitudesVerComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuario/:id', component: UsuariosVerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrarme', component: RegistrarComponent },
  { path: '#', redirectTo: '/login', pathMatch: 'full'},
  { path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
