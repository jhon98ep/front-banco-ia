import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ApiService } from '../Service/api.service';
import { FormBuilder } from '@angular/forms';
import { ComunicacionService } from '../Service/comunicacion.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarComponent {

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

  registrar_usuario = this.formBuilder.group({
    rol_id: 0,
    tipo_documento_id: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    contrasenia: '',
    numero_documento: ''
  });

  ngOnInit(): void {
      this.listarTipoDocumentos();
  }

  registrarUsuario(): void {
    let datos = this.registrar_usuario.value;
    this.apiService.peticionPost(datos, 'registrarme').subscribe((resp: any) => {
      if(resp.estado == true) {
          this.iniciarSesion();          
      }else{
          console.log(resp)
      }
    }); 
  }

  iniciarSesion(){
    this.router.navigateByUrl('/login')
  }

  async listarTipoDocumentos(pagina: number = -1){
    let datos = {}
    this.apiService.peticionGet(datos, 'listaMaestra/2/opciones').subscribe((resp: any) => {
      this.tipo_documento = [];
      if(resp.estado == true) {
          this.tipo_documento = resp.datos;
      }else{
          
      }
    });
  }
}
