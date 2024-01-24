import { Component } from '@angular/core';
import { ApiService } from '../Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RegistrarUsuarioComponent } from '../modal/registrar-usuario/registrar-usuario.component';
import { ComunicacionService } from '../Service/comunicacion.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  bsModalRef: BsModalRef | undefined;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private comunicacionService: ComunicacionService  
  ) { }

  usuarios = [];
  roles = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;

  filtros_busqueda_usuarios= this.formBuilder.group({
    rol_id: '',
    nombre: '',
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
    this.comunicacionService.usuarioAgregado$.subscribe(() => {
      this.listarUsuarios(1);
    });
    this.listarUsuarios(1);
    this.listarRoles();

  }

  abrirModal(): void {
    this.bsModalRef = this.modalService.show(RegistrarUsuarioComponent);
    this.bsModalRef.content.closeBtnName = 'Cerrar';
  }

  async listarUsuarios(pagina: number){
    let datos = {}
    let endPoint = 'usuarios?pagina='+pagina;
    endPoint = this.usuario_actual_perfil_id == 4 ? endPoint+'&gerente='+1 : endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.usuarios = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.usuarios = resp.datos;
      }else{
          
      }
    });
  }

  async listarRoles(pagina: number = -1){
    let datos = {}
    let endPoint = 'roles?pagina='+pagina;
    endPoint = this.usuario_actual_perfil_id == 4 ? endPoint+'&gerente='+1 : endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.roles = [];
      if(resp.estado == true) {
          this.roles = resp.datos;
      }else{
          
      }
    });
  }


  verUsuario(id : string){
    this.router.navigateByUrl('/usuario/'+id)
  }

  cambiarEstadoUsuario(id : string){
    let datos = {};
    this.apiService.peticionPatch(datos, 'usuarios/'+id+'/activo').subscribe((resp: any) => {
      if(resp.estado == true) {
        this.listarUsuarios(1);
      }else{
          console.log(resp)
      }
    }); 
  }

  filtrarUsuarios(){
    let datos = {}
    let filtros = this.filtros_busqueda_usuarios.value;
    let endPoint = 'usuarios?pagina=-1';
    endPoint = this.usuario_actual_perfil_id == 4 ? endPoint+'&gerente='+1 : endPoint;
    endPoint = filtros.rol_id != '' ? endPoint+'&rol_id='+filtros.rol_id : endPoint;
    endPoint = filtros.nombre != '' ?  endPoint+'&nombre='+filtros.nombre: endPoint;
    this.apiService.peticionGet(datos, endPoint).subscribe((resp: any) => {
      this.usuarios = [];
      if(resp.estado == true) {
          window.scrollTo(0, 0);
          this.total_registros = resp.total_registros;
          this.pagina_actual = resp.pagina_actual;
          this.pagina_final = resp.total_paginas;
          this.usuarios = resp.datos;
      }else{
          
      }
    });
  }
}
