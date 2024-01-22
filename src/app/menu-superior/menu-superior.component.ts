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

  ngOnInit(): void {
    this.authService.cargarUsuario();
    this.authService.getLoggueado2().subscribe((isLoggedIn) => {
      this.loggueado2 = isLoggedIn;
      if(this.loggueado2){
        this.authService.cargarUsuario();
      }
    });
  }

  cerrarSesion(){
    this.authService.cerrarSesion();
  }
}
