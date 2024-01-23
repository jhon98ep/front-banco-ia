import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrl: './menu-superior.component.css'
})
export class MenuSuperiorComponent {
  public loggueado2 : boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private location: Location
  ) {}

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;

  ngOnInit(): void {
    this.authService.cargarUsuario();
    this.authService.getLoggueado2().subscribe((isLoggedIn) => {
      this.loggueado2 = isLoggedIn;
      if(this.loggueado2){
        this.authService.cargarUsuario();
        this.usuario_actual = localStorage.getItem('usuarioActual');
        this.usuario_actual = JSON.parse(this.usuario_actual);
        this.usuario_actual_id = this.usuario_actual.usuario_id;
        this.usuario_actual_perfil_id = this.usuario_actual.rol_id;
      }
    });
  }

  cerrarSesion(){
    this.authService.cerrarSesion();
  }
}
