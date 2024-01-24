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

  usuario_actual : any;
  usuario_actual_id : number = 0;
  usuario_actual_perfil_id : number = 0;
  cargando = false;

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
    this.cargando = true;
    let datos = this.registrar_usuario.value;
    this.apiService.peticionPost(datos, 'usuarios').subscribe((resp: any) => {
      if(resp.estado == true) {
          this.comunicacionService.emitirUsuarioAgregado();
          this.cargando = false;
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
      this.usuario_actual_perfil_id = this.usuario_actual.rol_id;
    }else{
      this.router.navigateByUrl('/login')
    }
    this.listarRoles();
    this.listarTipoDocumentos();
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

  cerrarModal(){
    this.bsModalRef.hide();
  }
}
