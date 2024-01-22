import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ApiService } from '../../Service/api.service';
import { FormBuilder } from '@angular/forms';
import { ComunicacionService } from '../../Service/comunicacion.service';

@Component({
  selector: 'app-registrar-credito',
  templateUrl: './registrar-credito.component.html',
  styleUrl: './registrar-credito.component.css'
})
export class RegistrarCreditoComponent {

  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private comunicacionService: ComunicacionService
  ) {}

  tipo_credito = [];
  cuotas = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;

  registrar_solicitud_creditos = this.formBuilder.group({
    cliente_solicitante_id: 0,
    cuotas_solicitadas_id: 0,
    tipo_credito_id: 0,
    valor_solicitado: 0,
    descripcion: '',
    observaciones: ''
  });

  guardarDatos(): void {
    let datos = this.registrar_solicitud_creditos.value;
    datos.cliente_solicitante_id = this.usuario_actual_id;
    this.apiService.peticionPost(datos, 'solicitudCredito').subscribe((resp: any) => {
      if(resp.estado == true) {
          this.comunicacionService.emitirSolicitudAgregado();
          this.bsModalRef.hide();
      }else{
          console.log(resp)
      }
    });
    this.bsModalRef.hide();
    this.router.navigateByUrl('/solicitudes')
  }

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.listarNumeroCuotas();
    this.listarTipoCreditos();
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

  async listarTipoCreditos(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'tipoCredito').subscribe((resp: any) => {
      this.tipo_credito = [];
      if(resp.estado == true) {
          this.tipo_credito = resp.datos;
      }else{
          
      }
    });
  }
}
