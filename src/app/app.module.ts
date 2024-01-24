import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './inicio/inicio.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { CreditosComponent } from './creditos/creditos.component';
//import { AuthInterceptor } from './auth.interceptor';
import { SolicitudesCreditosComponent } from './solicitudes-creditos/solicitudes-creditos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RegistrarCreditoComponent } from './modal/registrar-credito/registrar-credito.component';
import { RegistrarUsuarioComponent } from './modal/registrar-usuario/registrar-usuario.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { UsuariosVerComponent } from './usuarios-ver/usuarios-ver.component';
import { SolicitudesVerComponent } from './solicitudes-ver/solicitudes-ver.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    MenuSuperiorComponent,
    CreditosComponent,
    SolicitudesCreditosComponent,
    UsuariosComponent,
    RegistrarCreditoComponent,
    RegistrarUsuarioComponent,
    RegistrarComponent,
    UsuariosVerComponent,
    SolicitudesVerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    //{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
