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
  estados = [];
  tipos = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;

  filtros_busqueda_creditos = this.formBuilder.group({
    estado_id: '',
    tipo_credito_id: '',
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
    this.listarEstados();
    this.listarTipos();
  }

  abrirModal(): void {
    this.bsModalRef = this.modalService.show(RegistrarCreditoComponent);
    this.bsModalRef.content.closeBtnName = 'Cerrar';
  }

  async listarSolicitudesCreditos(pagina: number){
    let datos = {}
    let endPoint = 'solicitudCredito?pagina='+pagina;
    endPoint = this.usuario_actual_perfil_id == 2 ? endPoint+'&cliente_solicitante_id='+this.usuario_actual_id : endPoint;
    endPoint = this.usuario_actual_perfil_id == 4 ? endPoint+'&estado_id='+3: endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.solicitudes = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.solicitudes = resp.datos;
      }
    });
  }

  async listarEstados(pagina: number = -1){
    let datos = {}
    this.apiService.peticionGet(datos, 'listaMaestra/1/opciones').subscribe((resp: any) => {
      this.estados = [];
      if(resp.estado == true) {
          this.estados = resp.datos;
      }else{
          
      }
    });
  }

  async listarTipos(pagina: number = -1){
    let datos = {}
    this.apiService.peticionGet(datos, 'tipoCredito').subscribe((resp: any) => {
      this.tipos = [];
      if(resp.estado == true) {
          this.tipos = resp.datos;
      }else{
          
      }
    });
  }

  verSolicitudCredito(id : string){
    this.router.navigateByUrl('/solicitud/'+id)
  }

  cancelarSolicitudCredito(id : string){
    let datos = {
      estado_id : 5
    };
    this.apiService.peticionPatch(datos, '/solicitudCredito/'+id+'/estado').subscribe((resp: any) => {
      if(resp.estado == true) {
        this.listarSolicitudesCreditos(1);
      }else{
          console.log(resp)
      }
    }); 
  }

  filtrarSolicitudesCreditos(){
    let datos = {}
    let filtros = this.filtros_busqueda_creditos.value;
    let endPoint = 'solicitudCredito?pagina=-1';
    endPoint = filtros.estado_id != '' ? endPoint+'&estado_id='+filtros.estado_id : endPoint;
    endPoint = filtros.tipo_credito_id != '' ?  endPoint+'&tipo_credito_id='+filtros.tipo_credito_id: endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.solicitudes = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.solicitudes = resp.datos;
      }
    })
  }
}
