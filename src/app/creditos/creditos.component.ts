import { Component } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RegistrarCreditoComponent } from '../modal/registrar-credito/registrar-credito.component';


@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  bsModalRef: BsModalRef | undefined;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService    
  ) { }

  creditos = [];
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
      this.usuario_actual_id = this.usuario_actual.usuario_id;
      this.usuario_actual_perfil_id = this.usuario_actual.rol_id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.listarCreditos(1);
    this.listarNumeroCuotas();
  }
  
  abrirModal(): void {
    this.bsModalRef = this.modalService.show(RegistrarCreditoComponent);
    this.bsModalRef.content.closeBtnName = 'Cerrar';
  }

  async listarCreditos(pagina: number){
    let datos = {}
    let endPoint = 'creditos?pagina='+pagina;
    endPoint = this.usuario_actual_perfil_id == 2 ? endPoint+'&cliente_solicitante_id='+this.usuario_actual_id : endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.creditos = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.creditos = resp.datos;
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

  filtrarCreditos(){
    let datos = {
      "pagina" : -1,
      "usuario_id" : this.usuario_actual_id,
    }
    let datos_unidos = {...datos, ...this.filtros_busqueda_creditos.value}
    this.apiService.peticionGet(datos_unidos, 'creditos').subscribe((resp: any) => {
      this.creditos = [];
      if(resp.resultado =! 'valido') {
      }else{
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.creditos = resp.datos;
      }
    })
  }

  verCredito(id : string){

  }
}
