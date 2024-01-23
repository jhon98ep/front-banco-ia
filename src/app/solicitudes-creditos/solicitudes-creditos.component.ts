import { Component } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ComunicacionService } from '../Service/comunicacion.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RegistrarCreditoComponent } from '../modal/registrar-credito/registrar-credito.component';

@Component({
  selector: 'app-solicitudes-creditos',
  templateUrl: './solicitudes-creditos.component.html',
  styleUrl: './solicitudes-creditos.component.css'
})
export class SolicitudesCreditosComponent {
  bsModalRef: BsModalRef | undefined;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private comunicacionService: ComunicacionService,
    private modalService: BsModalService
  ) { }

  solicitudes = [];
  cuotas = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;

  filtros_busqueda_creditos = this.formBuilder.group({
    filtro_numero_cuotas: '',
    numero_cuenta: '',
  });

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.id;
      this.usuario_actual_perfil_id = this.usuario_actual.rol_id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.comunicacionService.solicitudAgregado$.subscribe(() => {
      this.listarSolicitudesCreditos(1);
    });
    this.listarSolicitudesCreditos(1);
    this.listarNumeroCuotas();
  }

  abrirModal(): void {
    this.bsModalRef = this.modalService.show(RegistrarCreditoComponent);
    this.bsModalRef.content.closeBtnName = 'Cerrar';
  }

  async listarSolicitudesCreditos(pagina: number){
    let datos = {}
    let endPoint = 'solicitudCredito?pagina='+pagina;
    endPoint = this.usuario_actual_perfil_id == 2 ? endPoint+'&cliente_solicitante_id='+this.usuario_actual_id : endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.solicitudes = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.solicitudes = resp.datos;
      }else{
          
      }
    });
  }

  async listarNumeroCuotas(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'listaMaestra/3/opciones').subscribe((resp: any) => {
      this.cuotas = [];
      if(resp.estado == true) {
          this.cuotas = resp.datos;
      }else{
          
      }
    });
  }

  verSolicitudCredito(id : string){
    
  }

  filtrarSolicitudesCreditos(){
    let datos = {
      "pagina" : -1,
      "usuario_id" : this.usuario_actual_id,
    }
    let datos_unidos = {...datos, ...this.filtros_busqueda_creditos.value}
    this.apiService.peticionGet(datos_unidos, 'creditos').subscribe((resp: any) => {
      this.solicitudes = [];
      if(resp.resultado =! 'valido') {
      }else{
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.solicitudes = resp.datos;
      }
    })
  }
}
