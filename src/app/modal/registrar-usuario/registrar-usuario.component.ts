import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ApiService } from '../../Service/api.service';
import { FormBuilder } from '@angular/forms';
import { ComunicacionService } from '../../Service/comunicacion.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrl: './registrar-usuario.component.css'
})
export class RegistrarUsuarioComponent {
  
  constructor(
    public bsModalRef: BsModalRef,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private comunicacionService: ComunicacionService
  ) {}
 
  roles = [];
  tipo_documento = [];
  pagina_actual = 0;
  pagina_final = 0;
  total_registros = 0;

  usuario_actual : any;
  usuario_actual_id : number = 0;

  registrar_usuario = this.formBuilder.group({
    rol_id: 0,
    tipo_documento_id: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    contrasenia: '',
    numero_documento: ''
  });

  guardarDatos(): void {
    let datos = this.registrar_usuario.value;
    this.apiService.peticionPost(datos, 'usuarios').subscribe((resp: any) => {
      if(resp.estado == true) {
          this.comunicacionService.emitirUsuarioAgregado();
          this.bsModalRef.hide();
      }else{
          console.log(resp)
      }
    }); 
  }

  ngOnInit(): void {
    if(localStorage.getItem('usuarioLoggueado') == 'true'){
      this.usuario_actual = localStorage.getItem('usuarioActual');
      this.usuario_actual = JSON.parse(this.usuario_actual);
      this.usuario_actual_id = this.usuario_actual.id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.listarRoles();
    this.listarTipoDocumentos();
  }

  async listarRoles(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'roles').subscribe((resp: any) => {
      this.roles = [];
      if(resp.estado == true) {
          this.roles = resp.datos;
      }else{
          
      }
    });
  }

  async listarTipoDocumentos(pagina: number = -1){
    let datos = {
      "pagina" : pagina,
      "usuario_id" : this.usuario_actual_id,
    }
    this.apiService.peticionGet(datos, 'listaMaestra/2/opciones').subscribe((resp: any) => {
      this.tipo_documento = [];
      if(resp.estado == true) {
          this.tipo_documento = resp.datos;
      }else{
          
      }
    });
  }
}
